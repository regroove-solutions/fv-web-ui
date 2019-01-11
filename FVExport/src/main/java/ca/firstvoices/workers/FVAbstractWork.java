package ca.firstvoices.workers;

import org.nuxeo.ecm.core.work.AbstractWork;

abstract public class FVAbstractWork extends AbstractWork
{
    private String initiatorName;
    private String dialectName;
    private String dialectGUID;
    protected String exportFormat;
    protected String exportQuery;


    public FVAbstractWork( String id ) { super( id ); }

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
}
