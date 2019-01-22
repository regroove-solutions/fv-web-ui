package ca.firstvoices.utils;

import org.nuxeo.ecm.automation.core.util.StringList;
import org.nuxeo.ecm.core.api.DocumentModel;

public class FVEXport
{
   private String dialect;
   private String digest;
   private String query;
   private String columns;
   private String format;

   public String getDialect()
   {
       return dialect;
   }

   public void setDialect( String dialect )
   {
       this.dialect = dialect;
   }

   public String getDigest()
   {
       return digest;
   }

   public void setDigest( String digest )
   {
       this.digest = digest;
   }

   public String getQuery()
   {
       return query;
   }

   public void setQuery( String query )
   {
       this.query = query;
   }

    public String getColumns()
    {
        return columns;
    }

    public void setColumns(String columns)
    {
        this.columns = columns;
    }

    public String getFormat()
    {
        return format;
    }

    public void setFormat(String format)
    {
        this.format = format;
    }
}
