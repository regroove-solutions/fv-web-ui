import org.nuxeo.client.api.*;
import org.nuxeo.client.api.objects.Document;
import org.nuxeo.client.api.objects.Documents;
import org.nuxeo.client.api.objects.Operation;
import org.nuxeo.client.internals.spi.NuxeoClientException;

/**
 * Resources:
 * Nuxeo roadmap: http://roadmap.nuxeo.com/
 * Nuxeo playground: http://nuxeo.github.io/api-playground/
 * Nuxeo docs: https://doc.nuxeo.com/ (Note: this may take a week or two to read :-))
 * Nuxeo yeoman generator: https://www.npmjs.com/package/generator-nuxeo
 * Nuxeo services extensions point explorer: http://explorer.nuxeo.com/nuxeo/site/distribution/
 * JavaClient documentation: https://nuxeo.github.io/nuxeo-java-client/#toc1
 */

public class Test {

	public static void main(String[] argv) {
		

		NuxeoClient client = new NuxeoClient("http://localhost:8080/nuxeo/", "Administrator", "Administrator");

		try {

			try {
				Operation operation = client
						.schemas("dublincore", "common")
						.automation("Repository.Query")
						.param("query", "SELECT * FROM Document WHERE ecm:currentLifeCycleState"
								+ " <> 'deleted' AND ecm:path STARTSWITH "
								+ "'/default-domain/workspaces/assets'");
				Documents result = (Documents) operation.execute();		
				
				if (result != null) {
					for (Document doc : result.getDocuments()) {
						System.out.println(doc.getPath());
						System.out.println("Title:" + doc.getPropertyValue("dc:title"));
						System.out.println("***");
					}
				}
				
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		catch (NuxeoClientException e) {
			e.printStackTrace();
		}			
	}
}
