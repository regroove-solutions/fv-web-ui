package ca.firstvoices.property_readers;

import ca.firstvoices.utils.ExportColumnRecord;
import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class FV_CompoundPropertyReader extends FV_AbstractPropertyReader
{
    private FV_PropertyValueWithColumnName compound[];

    public ReaderType readerType()
    {
        return ReaderType.COMPOUND;
    }

    public FV_CompoundPropertyReader(CoreSession session, ExportColumnRecord spec )
    {
        super( session, spec );
        compound = spec.compound;
        maxColumns = compound.length;
    }

    public List<FV_PropertyValueWithColumnName> readPropertyFromObject(Object o) {
        DocumentModel doc = (DocumentModel) o;
        List<FV_PropertyValueWithColumnName> output = new ArrayList<>();

        try
        {
            Object obj = doc.getPropertyValue( propertyToRead );

            if( obj instanceof String[] )
            {
                String[] list = (String[]) obj;

                if( list.length != 0)
                {
                    DocumentModel refDoc = session.getDocument(new IdRef(list[0])); // TODO: add handling of multiple lines

                    if (refDoc == null) throw new Exception("FV_CompoundPropertyReader: Invalid document");

                    for (FV_PropertyValueWithColumnName prop : compound)
                    {
                        Object val = refDoc.getPropertyValue(prop.readPropertyValue);

                        if( val == null )
                        {
                            output.add(new FV_PropertyValueWithColumnName(prop.outputColumnName, "") );
                        }
                        else if( val instanceof String )
                        {
                            output.add(new FV_PropertyValueWithColumnName( prop.outputColumnName, (String)val));
                        }
                        else if( val instanceof Boolean )
                        {
                            Boolean b = (Boolean)val;
                            output.add(new FV_PropertyValueWithColumnName( prop.outputColumnName,  (b ? "true" : "false") ));
                        }
                        else if( val instanceof String[] )
                        {
                            String[] sa = (String[])val;
                            if( sa.length > 0 )
                            {
                                output.add(new FV_PropertyValueWithColumnName(prop.outputColumnName, sa[0]));
                            }
                            else
                            {
                                output.add(new FV_PropertyValueWithColumnName(prop.outputColumnName, ""));
                            }
                        }
                        else
                        {
                            output.add(new FV_PropertyValueWithColumnName(prop.outputColumnName, "FV_CompoundPropertyReader: unhandled property" ) );
                        }
                    }
                }
            }
        }
        catch( Exception e)
        {
            log.warn( e );
        }

        if( output.size() != maxColumns )
        {
            output = writeColumnDataWhenReceivingWrongObject();
        }

        return output;
    }

    @Override
    public StringList getColumnNameForOutput()
    {
        StringList columns = new StringList();

        for( FV_PropertyValueWithColumnName p : compound )
        {
           columns.add( p.outputColumnName );
        }

        return columns;
    }

    private  List<FV_PropertyValueWithColumnName> writeColumnDataWhenReceivingWrongObject()
    {
        List<FV_PropertyValueWithColumnName> output = new ArrayList<>();

        for (int i = 0; i < maxColumns; i++)
        {
            output.add(new FV_PropertyValueWithColumnName(compound[i].outputColumnName, ""));
        }

        return output;
    }
}
