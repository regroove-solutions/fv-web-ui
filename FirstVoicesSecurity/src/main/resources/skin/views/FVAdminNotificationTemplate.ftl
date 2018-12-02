<html>
<body>
New user created account in FirstVoices.
Provided credentials are : ${userinfo.firstName} ${userinfo.lastName}, <br />
<p>Username is: ${userinfo.login}</p>
<br />
<#if documentTitle != "">
<p>User registered to access dialect: ${documentTitle}.<p>
<#else>
<p></p>
</#if>
<#if comment != "">
<br/>
<p>Message from the sender: </p>
<p>${comment}</p>
</#if>

</body>
</html>