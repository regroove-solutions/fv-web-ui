{% extends 'layouts/application.swig' %}

{% block content %}
  <div id="app-wrapper" class="app-wrapper">
  	<div id="app-loader" class="app-loader">

	<div style="width: 50%; margin: 0 auto; border: 1px #ccc solid; padding: 15px;font-size: 16pt;">
		<p><strong>FirstVoices</strong></p>
		<p>FirstVoices is a suite of web-based tools and services designed to support Indigenous people engaged in language archiving, language teaching and culture revitalization.</p>
	</div>

	<p>Loading...</p>

	</div>
  </div>
{% endblock %}

{% block head %}


	<style type='text/css'>
	    /**
	    * Keyman web css hack
	    */
	    a[target="KeymanWebHelp"]{
	    	display:none!important;
	    }

	    a[target="KeymanWebHelp"] + div > select {
	    	left: 0!important;
	    	z-index:9999;
	    }

	    a[target="KeymanWebHelp"] + div > a > img {
	    	width:auto!important;
	    	height:auto!important;
	    	z-index:9999;
	    }

	    /** App Loader **/
        .app-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgb(170, 18, 37);
            color: #FFFFFF;
            text-align: center;
            padding-top: 50vh;
            font-size: 4rem;
        }

	</style>

	<!--<script type="text/javascript">
	  // Keyman web version 1.0
      // Keyman web configuration
      var KeymanWeb_BaseLayout = 'us';
      var KeymanWeb_Key = '1448903-1838145035-1686191541-1788601820-1931648301-770430851-137419212-1321514025-1354448499-6089773-1900982170-398620240-1642645188-259138820-1624539626-186574507-312974940-1031701310-333159238-979230591-606229797-1108664733-154661329-1813767793-2098172645-1779047060-676327869-1147485123-1298913405-416221900-1519051235';
      var KeymanWeb_Root = 'http://www.firstvoices.com/kmw/';
      var KeymanWeb_DefaultKeyboardName = '(Select keyboard)';

	</script>
	<script type="text/javascript" src="http://www.firstvoices.com/kmw/keymanweb.js"></script>-->

	{# Keyman web version 2.0 #}
	{#
	<script src="http://s.keyman.com/kmw/engine/408/keymanweb.js"></script>
	<script src="http://s.keyman.com/kmw/engine/408/kmwuitoggle.js"></script>
	#}

{% endblock %}

{% block javascript %}

	{% if buildENV == "production" %}

		<script type="text/javascript">
		Raven.config('https://9f99c993909b4dda85e7178a0eadc7fa@sentry.io/1212465').install();
		</script>

		<script type="text/javascript" src="https://priologic.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-rfrvv0/b/6/a44af77267a987a660377e5c46e0fb64/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=bf057d7a"></script>

		<!-- Matomo -->
		<script type="text/javascript">
		var _paq = _paq || [];
		/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
		_paq.push(['trackPageView']);
		_paq.push(['enableLinkTracking']);
		(function() {
			var u="//analytics.firstvoices.com/";
			_paq.push(['setTrackerUrl', u+'piwik.php']);
			_paq.push(['setSiteId', '1']);
			var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
			g.type='text/javascript'; g.async=true; g.defer=true; g.src=u + 'piwik.js'; s.parentNode.insertBefore(g,s);
		})();
		</script>
		<!-- End Matomo Code -->

	{% endif %}

{% endblock %}
