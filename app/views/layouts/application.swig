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

    <style>
      /* fallback */
      @font-face {
        font-family: 'Material Icons';
        font-style: normal;
        font-weight: 400;
        src: url('/assets/images/2fcrYFNaTjcS6g4U3t-Y5UEw0lE80llgEseQY3FEmqw.woff2') format('woff2');
      }

      .material-icons {
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        font-size: 24px;
        line-height: 1;
        letter-spacing: normal;
        text-transform: none;
        display: inline-block;
        white-space: nowrap;
        word-wrap: normal;
        direction: ltr;
        -webkit-font-feature-settings: 'liga';
        -webkit-font-smoothing: antialiased;
      }
    </style>

    <script type="text/javascript">
      // Alloy editor configuration
      window.ALLOYEDITOR_BASEPATH = window.CKEDITOR_BASEPATH = '/assets/vendor/alloyeditor/';
    </script>

    <link href="//fonts.googleapis.com/css?family=Roboto:100,400,500,500i,700,900&amp;subset=latin-ext" rel="stylesheet">

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

    <!-- v1.0.9 -->

  </body>
</html>