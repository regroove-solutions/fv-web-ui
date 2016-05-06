{% extends 'layouts/application.swig' %}

{% block content %}
  <div id="app-wrapper" class="app-wrapper">Loading...</div>
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

	</style>

	<script type="text/javascript">
	  // Keyman web version 1.0
      // Keyman web configuration
      var KeymanWeb_BaseLayout = 'us';
      var KeymanWeb_Key = '1448903-1838145035-1686191541-1788601820-1931648301-770430851-137419212-1321514025-1354448499-6089773-1900982170-398620240-1642645188-259138820-1624539626-186574507-312974940-1031701310-333159238-979230591-606229797-1108664733-154661329-1813767793-2098172645-1779047060-676327869-1147485123-1298913405-416221900-1519051235';
      var KeymanWeb_Root = 'http://www.firstvoices.com/kmw/';
      var KeymanWeb_DefaultKeyboardName = '(Select keyboard)';

	</script>
	<script type="text/javascript" src="http://www.firstvoices.com/kmw/keymanweb.js"></script>

	{# Keyman web version 2.0 #}
	{#
	<script src="http://s.keyman.com/kmw/engine/408/keymanweb.js"></script>
	<script src="http://s.keyman.com/kmw/engine/408/kmwuitoggle.js"></script>
	#}

{% endblock %}

{% block javascript %}
{% endblock %}

