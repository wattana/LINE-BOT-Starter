using Line.WebService.Repositories;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;

namespace Line.WebService
{
    public class Global : System.Web.HttpApplication
    {
        public static string DATE_FORMAT = "yyyyMMdd";
        public static string DATE_TIME_FORMAT = "yyyyMMddHHmmss";
        public static CultureInfo THAI_CULTUREINFO = CultureInfo.CreateSpecificCulture("th-TH");

        protected void Application_Start(object sender, EventArgs e)
        {
            NHibernateHelper.initApplication();
        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}