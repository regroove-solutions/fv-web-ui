/*
 * Contributors:
 *     Kristof Subryan <vtr_monk@mac.com>
 */
package ca.firstvoices.utils;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import org.codehaus.jackson.map.ObjectMapper;
import org.nuxeo.ecm.core.api.DocumentModel;

import java.util.HashMap;
import java.util.Map;


public class FVUserPreferencesSetup {

    /**
     * @param existingUserObject
     * @param registration
     * @throws Exception
     */
    public void updateUserPreferences(DocumentModel existingUserObject, DocumentModel registration ) throws Exception
    {
        CustomPreferencesObject userPreferencesObj = new CustomPreferencesObject();

        // Create general preferences
        Map<String, Object> generalPreferences = new HashMap<>();
        generalPreferences.put("primary_dialect", registration.getPropertyValue("docinfo:documentId"));

        // Create navigation preferences
        Map<String, Object> navigationPreferences = new HashMap<>();
        navigationPreferences.put("start_page", "my_dialect");

        // Create theme preferences
        Map<String, Object> themePreferences = new HashMap<>();
        themePreferences.put("font_size", "default");

        // Set general, navigation and theme preferences
        userPreferencesObj.setGeneralPreferences(generalPreferences);
        userPreferencesObj.setNavigationPreferences(navigationPreferences);
        userPreferencesObj.setThemePreferences(themePreferences);

        ObjectMapper mapper = new ObjectMapper();

        String modifiedPreferencesString = mapper.writeValueAsString( userPreferencesObj );

        existingUserObject.setPropertyValue("user:preferences", modifiedPreferencesString);
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonPropertyOrder({ "General", "Navigation", "Theme" })
    private class CustomPreferencesObject {

        @JsonProperty("General")
        private Map<String, Object> generalPreferences = new HashMap<>();

        @JsonProperty("Navigation")
        private Map<String, Object> navigationPreferences = new HashMap<>();

        @JsonProperty("Theme")
        private Map<String, Object> themePreferences = new HashMap<>();

        public Map<String, Object> getGeneralPreferences() {
            return generalPreferences;
        }

        public void setGeneralPreferences(Map<String, Object> generalPreferences) {
            this.generalPreferences = generalPreferences;
        }

        public Map<String, Object> getNavigationPreferences() {
            return navigationPreferences;
        }

        public void setNavigationPreferences(Map<String, Object> navigationPreferences) {
            this.navigationPreferences = navigationPreferences;
        }

        public Map<String, Object> getThemePreferences() {
            return themePreferences;
        }

        public void setThemePreferences(Map<String, Object> themePreferences) {
            this.themePreferences = themePreferences;
        }
    }
}

