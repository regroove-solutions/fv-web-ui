package ca.firstvoices.utils;

import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.DocumentModel;

import java.io.Serializable;
import java.util.List;

public class FVExportWorkInfo implements Serializable
{
    public String fileName;
    public String fileNameAsSaved;
    public String filePath;
    public String initiatorName;
    public String dialectName;
    public String dialectGUID;
    public String resourcesFolderGUID;
    public String exportFormat;
    public String exportQuery;
    public long fileLength;
    public String workDigest;       // connects principal with export query based on  MD5( principal.name + principal.hash )
    public String exportDigest;     // identifies export based on query, columns and principal info ( MD5 hash )
    public StringList columns;
    public DocumentModel wrapper;

    public String getFullFileName()
    {
        if( filePath == null || fileNameAsSaved == null) return null;

        return filePath + fileNameAsSaved;
    }

    public String getWrapperName()
    {
        if( exportDigest == null ) return null;
        return "Export-" + exportDigest;
    }

    public void setExportProgress( String progress )
    {
        if( wrapper == null ) return;
        wrapper.setPropertyValue( "fvexport:progress",  progress);
    }
}
