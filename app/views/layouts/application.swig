<!DOCTYPE html>
<!--[if lte IE 8]><html class="lt-ie9  no-js" lang="en"><![endif]-->
<!--[if gt IE 8]><!--><html lang="en"  class="no-js"><!--<![endif]-->
  <head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <title>{% block title %}FirstVoices{% endblock %}</title>
    <meta name="description" content=""/>
    <meta name="author" content=""/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>

    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

   <script>
      window.ALLOYEDITOR_BASEPATH = window.CKEDITOR_BASEPATH = '/assets/vendor/alloyeditor/';
    </script>

    {% block head %}{% endblock %}
  </head>
  <body id="body">

    <div id="wrapper">

        <div class="container-fluid" id="page-wrapper">
            {% block content %}{% endblock %}
        </div>
        <!-- /#page-wrapper -->

    </div>
    <!-- /#wrapper -->

    <script src="/assets/javascripts/shared.js"></script>
    <script src="/assets/javascripts/app.js"></script>
    {% block javascript %}{% endblock %}

  </body>
</html>