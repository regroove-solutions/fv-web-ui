package ca.firstvoices.utils;

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
    public List<String> columns;

    public String getFullFileName()
    {
        if( filePath == null || fileNameAsSaved == null) return null;

        return filePath + fileNameAsSaved;
    }
}
