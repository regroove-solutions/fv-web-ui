import React from 'react';
import classNames from 'classnames';

export default class Index extends React.Component {

  static inlineStyles = {
    marginRight: '25px'
  };

  static tableStyles = {
    marginRight: 'auto',
    marginLeft: 'auto'
  };

  render() {

    return <div>

            <div className="row">
              <div className={classNames('col-xs-12', 'col-md-7')}>
                <img src="http://www.firstvoices.com/img/english.gif"/>
                <img src="http://www.firstvoices.com/img/logo.gif"/>
                <img src="http://www.firstvoices.com/img/french.gif"/>
              </div>
              <div className={classNames('col-xs-12', 'col-md-5')}>
                <img src="http://www.firstvoices.com/img/fv-girl.jpg"/>
              </div>
              <div className="col-xs-12">
                <a className={classNames('btn', 'btn-default')} style={this.inlineStyles} href="#get-started">English</a> 
                <a className={classNames('btn', 'btn-default')} style={this.inlineStyles} href="#get-started">French</a>
              </div>   
            </div>  
            <div className={classNames('row', 'supporters')}>
              <div className={classNames('col-xs-12', 'text-center')}>
                <p>
                  <a href="http://www.fpcc.ca/" target="_blank"><img src="http://www.firstvoices.com/img/fphlcc-logo_sm.gif" alt="First Peoples' Heritage Language and Culture Council " width="145" height="36" hspace="5" border="0" align="absmiddle"/></a> &nbsp;&nbsp; 
                  <a href="http://www.fpcf.ca/" target="_blank"><img src="http://www.firstvoices.com/img/fpcf-logo_sm.gif" alt="First Peoples' Cultural Foundation   " width="199" height="36" hspace="5" border="0" align="absmiddle"/></a>
                </p>
                  
                <p>
                  We gratefully acknowledge the following supporters:
                </p>


<table style={this.tableStyles} align="center"><tbody>
<tr align="center" valign="middle">
<td bgcolor="#FFFFFF" align="center">
<a href="http://www.gov.bc.ca/arr/" target="_blank">
<img  src="http://www.firstvoices.com/img/BC_ARR_H.jpg" alt="Ministry of Aboriginal Relations and Reconcilation" width="127" height="36" border="0" align="absmiddle" />
</a><br/>
  &nbsp;<br/>
<a href="http://www.pch.gc.ca/" target="_blank">
<img  src="http://www.firstvoices.com/img/logo_pch.gif" alt="Canadian Heritage" width="180" height="36" border="0" align="absmiddle" />
</a></td><td bgcolor="#FFFFFF" align="center"><a href="http://www.fntc.info/" target="_blank"><img  src="http://www.firstvoices.com/img/FNTC.gif" alt="First Nation Technology Council" width="88" height="87" border="0"/></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td bgcolor="#FFFFFF"><a href="http://www.newrelationshiptrust.ca/" target="_blank"><img  src="http://www.firstvoices.com/img/New-NRT-Logo-sm.jpg" alt="New Relationship Trust" width="126" height="88" border="0" align="absmiddle" /></a>&nbsp;&nbsp;</td>
            
                <td bgcolor="#FFFFFF" align="center"><a href="http://www.languagegeek.com" target="_blank"><img  src="http://www.firstvoices.com/img/lg.gif" alt="Languagegeek.com" width="191" height="36" border="0"/></a><br/>&nbsp;<br/>
          <a href="http://www.tavultesoft.com/" target="_blank"><img  src="http://www.firstvoices.com/img/tav.gif" alt="Tavultesoft" width="191" height="29" border="0"/></a></td>
              </tr>
</tbody></table>


              </div>
            </div>
          </div>;
  }
}