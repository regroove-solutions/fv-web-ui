package ca.firstvoices.workers;


import ca.firstvoices.utils.FVExportCSVColumns;
import ca.firstvoices.utils.FVExportCompletionInfo;
import org.nuxeo.ecm.core.work.AbstractWork;
import java.util.ArrayList;
import java.util.List;

/*
 Exporting FVWords and FVPhrases

 FVAbstractExportWork defines an approach to exporting words & phrases by language administrators.
 There are 2 types of inherited workers.
 FVExportWorker - providing an on-demand generation of CSV or PDF files when triggered by language administrator.
                  This worker will not perform any checks on if any words were updated and need to be regenerated
                  in the one of the supported formats.
                  When created worker id will be defined as <INITIATING_PRINCIPAL> + "-" + <DIALECT_NAME_TO_EXPORT>+"-" + <EXPORT_FORMAT>.
                  Worker id will be used as the file name for the output.
                  Benefits of this approach are:
                  - only one worker per format + dialect + principal may be running at a time
                  - there can be only 2 workers, 1 for each format, running at a time (based on the previous rule)
                  - exported files are easily identifiable
                  - we can use ACLs associated with each file to restrict access for download
                  Exported files will be placed in Export directory which will be created in each dialect hierarchy.
                  They can be downloaded, once completed, by the originator of the export.

FVCyclicExportWorker - is a more complex version of an exporter. It is not meant to be started by a user but rather by the system (cron).
                  Its main purpose is to visit ALL Export folders in FV tree and keep them updated to most current version of exported
                  words and phrases in each dialect.
                  Basically it is a worker which keeps export files in sync with the changes in a dialect dictionary.
                  An export file has to be already created by a language administrator in order to be updated.
                  This worker will not create any new files.
                  Update of the exported file depends on the parameters contained within meaning the choices made by a language administrator,
                  with regards to format and information to be exported, will be replicated.
                  A new export file will be generated ONLY if there are words or phrases which changed since the last export.
                  There will be only ONE FVCyclicExportWorker running at a time.
                  To reduce impact on the system cron will trigger start in the least busy server operation times.

*/

abstract public class FVAbstractExportWork extends AbstractWork
{
    private String initiatorName;
    private String dialectName;
    private String dialectGUID;
    protected String exportFormat;
    protected String exportQuery;
    protected List<String> columns;


    public FVAbstractExportWork( String id )
    {
        super( id );

    }

    public String getInitiatorName() {  return initiatorName; }
    public void setInitiatorName( String name ) { initiatorName = name; }

    public String getDialectName() {  return dialectName; }
    public void setDialectName( String dname ) { dialectName = dname; }

    public String getDialectGUID() {  return dialectGUID; }
    public void setDialectGUID( String dguid ) { dialectGUID = dguid; }

    public String getExportFormat() {  return exportFormat; }
    public void setExportFormat( String eFormat ) { exportFormat = eFormat; }

    public String getExportQuery() {  return exportQuery; }
    public void setExportQuery( String eQuery ) { exportQuery = eQuery; }

    public List<String> getExportColumns() {  return columns; }
    public void setExportColumns( List<String> clist ) { columns = clist; }

    public FVExportCompletionInfo getWorkInfo()
    {
        FVExportCompletionInfo info = new FVExportCompletionInfo();
        info.initiatorName = initiatorName;
        info.dialectName = dialectName;
        info.dialectGUID = dialectGUID;
        info.exportFormat = exportFormat;
        info.exportQuery = exportQuery;
        info.columns = columns;

        return info;
    }
}
