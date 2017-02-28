using IBSs.SecurityLibrary;
using Line.WebService.Commons;
using Line.WebService.Models;
using Line.WebService.Repositories;
using NHibernate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

namespace Line.WebService
{
    /// <summary>
    /// Summary description for LoginService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class LoginService : System.Web.Services.WebService
    {

        [WebMethod]
        public JsonData login(string userLogin , string password)
        {
            JsonData jd = new JsonData();

            HttpRequest request = HttpContext.Current.Request;
            Encryption objE = new Encryption(Encryption.Providers.TripleDES);
            //Encryption objE2 = new Encryption(Encryption.Providers.Rijndael);

            using (ISession session = NHibernateHelper.OpenSession())
            {
                try
                {
                    var model = session.CreateQuery("from Agents where UserId=?").SetParameter(0, userLogin).UniqueResult<Agents>();
                    if (model != null)
                    {
                        string pwd = objE.Encrypt(password, "SME");
                        //string pwd2 = objE.Encrypt(password, "IBSsPublicKey");
                        if (model.UserPwd == pwd)
                        {
                            jd.success = true;
                            //jd.rows = new List<SerializableDictionary<string, object>>();
                            //jd.rows.Add(ObjectToDictionaryHelper.ToDictionary(model));
                            jd.refId = model.AgentId.ToString();
                        }
                        else
                        {
                            jd.success = false;
                            jd.msg = "รหัสผ่านไม่ถูกต้อง";
                        }

                    }
                    else
                    {
                        jd.success = false;
                        jd.msg = "ไม่พบข้อมูลผู้ใช้ระบบ";
                    }
                }
                catch (Exception ex)
                {
                    jd.success = false;
                    jd.msg = ex.Message;
                }
            }


            return jd;
        }

        [WebMethod]
        public JsonData autoLogin(string agentId)
        {
            JsonData jd = new JsonData();

            using (ISession session = NHibernateHelper.OpenSession())
            {
                try
                {
                    var model = session.Get<Agents>(Guid.Parse(agentId));
                    if (model != null)
                    {
                        jd.success = true;
                        jd.refId = model.AgentId.ToString();
                    }
                    else
                    {
                        jd.success = false;
                        jd.msg = "ไม่พบข้อมูลผู้ใช้ระบบ";
                    }
                }
                catch (Exception ex)
                {
                    jd.success = false;
                    jd.msg = ex.Message;
                }
            }


            return jd;
        }
    }
}
