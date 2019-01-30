package ca.firstvoices.property_readers;

import ca.firstvoices.format_producers.FV_AbstractProducer;
import ca.firstvoices.utils.ExportColumnRecord;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.*;

import java.util.ArrayList;
import java.util.List;

import static ca.firstvoices.utils.FVExportUtils.makePropertyReader;

public class FV_CompoundPropertyReader extends FV_AbstractPropertyReader
{
    private FV_DataBinding[]    compound;
    private List<FV_AbstractPropertyReader>     compoundReaders;

    public ReaderType readerType()
    {
        return ReaderType.COMPOUND;
    }

    public FV_CompoundPropertyReader( CoreSession session, ExportColumnRecord spec, FV_AbstractProducer specOwner )
    {
        super( session, spec, specOwner );
        compound = spec.compound;
        maxColumns = compound.length;

        // storage for compoundReaders needs to be initialized before making readers
        compoundReaders = new ArrayList<>();
        makeReaders();
    }

    public List<FV_DataBinding> readPropertyFromObject(Object o)
    {
        DocumentModel doc = (DocumentModel) o;

        List<FV_DataBinding> compoundOutput = new ArrayList<>();

        try
        {
            Object obj = doc.getPropertyValue( propertyToRead );

            if( obj instanceof String[] )
            {
                String[] list = (String[]) obj;

                if( list.length != 0)
                {
                     for( String guid : list )
                    {
                        DocumentModel refDoc = session.getDocument( new IdRef(guid) );

                        List<FV_DataBinding> output = new ArrayList<>();

                        if (refDoc == null) throw new Exception("FV_CompoundPropertyReader: Invalid document");

                        for (FV_AbstractPropertyReader prop : compoundReaders)
                        {
                            List<FV_DataBinding> listToAdd;

                            try
                            {
                                listToAdd = prop.readPropertyFromObject(refDoc);
                            }
                            catch (Exception e)
                            {
                                listToAdd = propertyDoesNotExist(prop.columnNameForOutput);
                            }

                            output.addAll(listToAdd);
                        }

                        compoundOutput.add( createCompoundProperty( columnNameForOutput, output ) );
                    }
                }
            }
        }
        catch( Exception e)
        {
            log.warn( e );
        }

        if( compoundOutput.size() == 0 )
        {
            compoundOutput.add( createCompoundProperty( columnNameForOutput, writeEmptyRow() ));
        }

        return createCompoundListOutput( columnNameForOutput, compoundOutput );
    }


//    public List<FV_DataBinding> readPropertyFromObject_old(Object o) {
//        DocumentModel doc = (DocumentModel) o;
//        List<FV_DataBinding> output = new ArrayList<>();
//
//        try
//        {
//            Object obj = doc.getPropertyValue( propertyToRead );
//
//            if( obj instanceof String[] )
//            {
//                String[] list = (String[]) obj;
//
//                if( list.length != 0)
//                {
//                    DocumentModel refDoc = session.getDocument(new IdRef(list[0]));
//
//                    if (refDoc == null) throw new Exception("FV_CompoundPropertyReader: Invalid document");
//
//                    for (FV_DataBinding prop : compound)
//                    {
//                        Object val = refDoc.getPropertyValue((String)prop.readPropertyValue);
//
//                        if( val == null )
//                        {
//                            output.add(new FV_DataBinding(prop.outputColumnName, "") );
//                        }
//                        else if( val instanceof String )
//                        {
//                            output.add(new FV_DataBinding( prop.outputColumnName, (String)val));
//                        }
//                        else if( val instanceof Boolean )
//                        {
//                            Boolean b = (Boolean)val;
//                            output.add(new FV_DataBinding( prop.outputColumnName,  (b ? "true" : "false") ));
//                        }
//                        else if( val instanceof String[] )
//                        {
//                            String[] sa = (String[])val;
//                            if( sa.length > 0 )
//                            {
//                                output.add(new FV_DataBinding(prop.outputColumnName, sa[0]));
//                            }
//                            else
//                            {
//                                output.add(new FV_DataBinding(prop.outputColumnName, ""));
//                            }
//                        }
//                        else
//                        {
//                            output.add(new FV_DataBinding(prop.outputColumnName, "FV_CompoundPropertyReader: unhandled property" ) );
//                        }
//                    }
//                }
//            }
//        }
//        catch( Exception e)
//        {
//            log.warn( e );
//        }
//
//        if( output.size() != maxColumns )
//        {
//            output = writeEmptyRow();
//        }
//
//        return output;
//    }

    @Override
    public StringList getColumnNameForOutput()
    {
        if( columns != null ) return columns;

        columns = new StringList();

        for( FV_DataBinding p : compound )
        {
            columns.add( p.outputColumnName );
        }

        return columns;
    }

    private void makeReaders()
    {
        if( compoundReaders.size() > 0 ) return;

        for ( FV_DataBinding pvc : compound )
        {
            try
            {
                ExportColumnRecord spec = specOwner.getSpec().getColumnExportRecord( pvc.getKey() );
                FV_AbstractPropertyReader instance = makePropertyReader(session, spec, specOwner );
                compoundReaders.add(instance);
            }
            catch ( Exception e )
            {
                e.printStackTrace();
            }
        }
    }

    private FV_DataBinding createCompoundProperty(String colName, List<FV_DataBinding> list )
    {
        return new FV_DataBinding( colName,list);
    }

    private List<FV_DataBinding> createCompoundListOutput(String colName, List<FV_DataBinding> list )
    {
        List<FV_DataBinding> compoundReturnOutput = new ArrayList<>();
        compoundReturnOutput.add( new FV_DataBinding( colName,list) );
        return compoundReturnOutput;
    }

}
