package ca.firstvoices.utils;

import org.apache.commons.codec.digest.DigestUtils;
import org.nuxeo.ecm.core.api.impl.blob.FileBlob;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import static ca.firstvoices.utils.FVExportUtils.getDataBlobDirectoryPath;

public class FVBlobRelocatorAccessor
{
    private FileBlob fileBlob;
    private FVExportWorkInfo exportFileInfo;
    private Path newRelocationPath;
    private String fileDigest;

    // NOTE: use this initializer when creating and moving new blob
    public FVBlobRelocatorAccessor(FileBlob fb, FVExportWorkInfo info) {
        fileBlob = fb;
        exportFileInfo = info;
    }

    // NOTE: use this initializer when accessing existing blob with digest key
    public FVBlobRelocatorAccessor(String digest)
    {
        fileDigest = digest;
    }


    public static Boolean checkIfDigestExists(String digest)
    {
        String path = getDataDirectoryPathToDigest(digest);
        File digestFile = new File( path );
        return digestFile.exists();
    }

    private static String getSubPathFromDigest(String digest)
    {
        String fDir = digest.substring(0, 2); // first two characters of the digest
        String sDir = digest.substring(2, 4);

        return fDir + "/" + sDir + "/";
    }
    private static String getPartialPathToDigest(String digest)
    {
        return getSubPathFromDigest(digest) + digest;
    }

    private static String getDataDirectoryPathToDigest(String digest)
    {
        // fDir + "/" + sDir + "/" + digest;
        String partialPath = getPartialPathToDigest(digest);
        // $NUXEO_HOME/data/binaries/
        String nuxeo_path = getDataBlobDirectoryPath();

        return nuxeo_path + partialPath;
    }

    public static String getPathForDigest( String digest )
    {
        if( checkIfDigestExists( digest ))
        {
            return getDataDirectoryPathToDigest(digest);
        }

        return null;
    }

    public String getPathForDigest()
    {
        assert (fileDigest != null) : "Cannot use fileDigest == null to get path to digest.";

        if( checkIfDigestExists() )
        {
            return getDataDirectoryPathToDigest( fileDigest );
        }

        return null;
    }

    public Boolean checkIfDigestExists()
    {
        assert (fileDigest != null ) :  "Cannot check if fileDigest == null exists.";
        return checkIfDigestExists( fileDigest );
    }

    private static String deleteDigest( String digest )  throws IOException
    {
        String path = getDataDirectoryPathToDigest(digest);
        Files.deleteIfExists( Paths.get(path) );

        return path;
    }

    public static void deleteDigestAndPartialDirectoryStructure(String digest) throws IOException
    {
        String path = deleteDigest(digest);

        int i = path.lastIndexOf('/');
        path = path.substring(0, i);
        Files.deleteIfExists(Paths.get(path));

        i = path.lastIndexOf("/");
        path = path.substring(0, i);
        Files.deleteIfExists(Paths.get(path));
    }

    public File getFileForDigest( String digest ) throws NullPointerException
    {
        String digestPath = getDataDirectoryPathToDigest( digest );
        File digestFile = new File( digestPath );
        return digestFile;
    }

    public FileInputStream getInputStreamForDigest( String digest ) throws FileNotFoundException
    {
        String digestPath = getDataDirectoryPathToDigest( digest );
        FileInputStream fileStream = new FileInputStream( digestPath );
        return fileStream;
    }

    public FileReader getFileReaderForDigest( String digest ) throws FileNotFoundException
    {
        String digestPath = getDataDirectoryPathToDigest( digest );
        FileReader fileReader = new FileReader( digestPath );
        return fileReader;
    }
}
