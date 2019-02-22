<%@ page contentType="text/html; charset=UTF-8"%>
<%@ page language="java"%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%

Cookie cookie = null;
Cookie[] cookies = null;

// Get an array of Cookies associated with the this domain
cookies = request.getCookies();

boolean JSESSIONIDExists = false;

if( cookies != null ) {
   for (int i = 0; i < cookies.length; i++) {
      cookie = cookies[i];
      if (cookie.getName( ).equals("JSESSIONID")) {
        JSESSIONIDExists = true;
      }
   }

   if (JSESSIONIDExists) {
    Cookie resetJSESSIONID = new Cookie("JSESSIONID", null);
    resetJSESSIONID.setMaxAge(0);
    resetJSESSIONID.setPath("/");
    response.addCookie(resetJSESSIONID);
   }

   response.sendRedirect("/nuxeo/logout");
} else {
  response.sendRedirect("/nuxeo/login.jsp?nxtimeout=true&forceAnonymousLogin=true");
}

%>

<!DOCTYPE html>
<!--[if lte IE 8]>
<html class="lt-ie9  no-js" lang="en">
   <![endif]-->
<!--[if gt IE 8]><!-->
<html lang="en"  class="no-js">
	<!--<![endif]-->
  <head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <title>FirstVoices - Login</title>
    <meta name="description" content="FirstVoices is a suite of web-based tools and services designed to support Indigenous people engaged in language archiving, language teaching and culture revitalization."/>
    <meta name="author" content="FPCC"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  </head>
  <body id="body">
    Redirecting...
  </body>
</html>
