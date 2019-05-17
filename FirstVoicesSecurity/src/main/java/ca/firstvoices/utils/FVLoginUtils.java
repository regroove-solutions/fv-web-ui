package ca.firstvoices.utils;

import org.apache.commons.lang3.StringUtils;
import org.nuxeo.ecm.platform.ui.web.rest.RestHelper;
import org.nuxeo.runtime.api.Framework;

public class FVLoginUtils {

    // this is configured with a property to be set easily in nuxeo.conf in different envs
    static String fvContextPath = Framework.getProperty("fv.contextPath", "app");

    public static String getBaseURL(RestHelper restHelper) {
        String NUXEO_URL = restHelper.getBaseURL();
        if (StringUtils.isEmpty(fvContextPath)) {
            // if we don't serve /app we don;t need /nuxeo in the url either
            NUXEO_URL = restHelper.getBaseURL().replaceAll(restHelper.getContextPath(), "");
        }

        return NUXEO_URL;
    }
}
