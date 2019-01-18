package ca.firstvoices.utils;

import java.io.Serializable;
import java.util.List;

public class FVExportCompletionInfo implements Serializable
{
    public String fileName;
    public String fileNameAsSaved;
    public String filePath;
    public String initiatorName;
    public String dialectName;
    public String dialectGUID;
    public String exportFormat;
    public String exportQuery;
    public long fileLength;
    public List<String> columns;

    public String getFullFileName()
    {
        return filePath + fileNameAsSaved;
    }
}
