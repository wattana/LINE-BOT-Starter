using Line.WebService.Commons;
using Line.WebService.Models;
using Line.WebService.Repositories;
using NHibernate;
using NHibernate.Criterion;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

namespace Line.WebService
{
    /// <summary>
    /// Summary description for LineService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class LineService : System.Web.Services.WebService
    {

        [WebMethod]
        public string TestSendText(string text)
        {
            var json = new
            {
                to = "Uaa89e07dfe96f3b66fe7937cf9e2c591",
                messages = new[] {
                    new {
                        type = "text",
                        text = text
                    }
                }
            };
            string str = @"{
                ""to"": ""Uaa89e07dfe96f3b66fe7937cf9e2c591"",
                ""messages"":[
                    {
                        ""type"":""text"",
                        ""text"":""Hello, world1""
                    }
                ]}";
            Console.WriteLine(str);
            //Json jObject = JsonObj.Parse(str);
            var jss = new JavaScriptSerializer();

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Authorization", ConfigurationManager.AppSettings["TOKEN"]);
                var response = client.PostAsync("https://api.line.me/v2/bot/message/push",
                        new StringContent(jss.Serialize(json),
                            Encoding.UTF8, "application/json"))
                            .Result;

                if (response.IsSuccessStatusCode)
                {
                    dynamic content = response.Content.ReadAsStringAsync().Result;
                    Console.WriteLine(content);
                    // Access variables from the returned JSON object
                    //var appHref = content.links.applications.href;
                }
            }
            return "Hello World";
        }

        [WebMethod]
        public string TestListContactPerson()
        {
            var ttt = new DateTime(1488182213199);
            var request = (HttpWebRequest)WebRequest.Create("https://imind.ibss.co.th/Line.WebService/LineService.asmx/ListContactPerson");
            request.Method = "POST";
            request.ContentType = "application/json";
            request.Accept = "application/json";
            string DATA = @"{""contactId"":""489057F9-1F48-49B6-9464-BD2247C23642""}";
            request.ContentLength = DATA.Length;
            using (Stream webStream = request.GetRequestStream())
            using (StreamWriter requestWriter = new StreamWriter(webStream, System.Text.Encoding.ASCII))
            {
                requestWriter.Write(DATA);
            }
            string text;
            var response = (HttpWebResponse)request.GetResponse();
            using (var sr = new StreamReader(response.GetResponseStream()))
            {
                text = sr.ReadToEnd();
            }
            return text;
        }

        [WebMethod]
        public string TestSendImage()
        {
            WebResponse wresp = null;
            string url = "http://vm:46233/lineservice.asmx/SendImage";//"http://10.75.1.84:8080/sign/sign";
            HttpWebRequest wr;

            try
            {
                //System.Diagnostics.Debug.WriteLine(string.Format("Uploading {0} to {1}", file, url));
                string boundary = "---------------------------" + DateTime.Now.Ticks.ToString("x");
                byte[] boundarybytes = System.Text.Encoding.ASCII.GetBytes("\r\n--" + boundary + "\r\n");

                wr = (HttpWebRequest)WebRequest.Create(url);
                wr.ContentType = "multipart/form-data; boundary=" + boundary;
                wr.Method = "POST";
                wr.KeepAlive = true;
                wr.Credentials = System.Net.CredentialCache.DefaultCredentials;

                Stream rs = wr.GetRequestStream();

                NameValueCollection values = new NameValueCollection();
                values.Add("agentId", "Alan");
                values.Add("contactId", "Alan fff");
                foreach (string key in values.Keys)
                {
                    // Write item to stream
                    byte[] formItemBytes = System.Text.Encoding.UTF8.GetBytes(string.Format("Content-Disposition: form-data; name=\"{0}\";\r\n\r\n{1}", key, values[key]));
                    rs.Write(boundarybytes, 0, boundarybytes.Length);
                    rs.Write(formItemBytes, 0, formItemBytes.Length);
                }
                //string formdataTemplate = "Content-Disposition: form-data; name=\"{0}\"\r\n\r\n{1}";

                rs.Write(boundarybytes, 0, boundarybytes.Length);

                string headerTemplate = "Content-Disposition: form-data; name=\"{0}\"; filename=\"{1}\"\r\nContent-Type: {2}\r\n\r\n";
                string header = string.Format(headerTemplate, "imageFile", "file", "image/png");
                byte[] headerbytes = System.Text.Encoding.UTF8.GetBytes(header);
                rs.Write(headerbytes, 0, headerbytes.Length);

                var file =  Server.MapPath("no_pictures.jpg"); ;
                FileStream fileStream = new FileStream(file, FileMode.Open, FileAccess.Read);
                byte[] buffer = new byte[4096];
                int bytesRead = 0;
                while ((bytesRead = fileStream.Read(buffer, 0, buffer.Length)) != 0)
                {
                    rs.Write(buffer, 0, bytesRead);
                }
                fileStream.Close();

                byte[] trailer = System.Text.Encoding.ASCII.GetBytes("\r\n--" + boundary + "--\r\n");
                rs.Write(trailer, 0, trailer.Length);
                rs.Close();

                wresp = wr.GetResponse();
                Stream stream = wresp.GetResponseStream();
                StreamReader reader = new StreamReader(stream);
                string Result = reader.ReadToEnd();

                JavaScriptSerializer json_serializer = new JavaScriptSerializer();
                //digiSignReponse = json_serializer.Deserialize<DigiSign>(Result.Trim());

            }
            catch (Exception ex)
            {

                if (wresp != null)
                {
                    wresp.Close();
                    wresp = null;
                }
            }
            finally
            {
                wr = null;
            }
            return "ok";
        }

        [WebMethod]
        public JsonData ListContactPerson(string contactId) {
            JsonData jd = new JsonData();
            var list = new List<SerializableDictionary<string, object>>();
            using (ISession session = NHibernateHelper.OpenSession())
            {
                ICriteria criteria = session.CreateCriteria<LineContacts>()
                                            .Add(Expression.Eq("ContactId", Guid.Parse(contactId)))
                                            .Add(Expression.Eq("ActiveFlag","1"));
                var models = criteria.List<LineContacts>();
                foreach (var model in models)
                {
                    var dict = ObjectToDictionaryHelper.ToDictionary(model);
                    var contactPerson = session.Get<ContactPersons>(model.ContactPersonId);
                    dict["PersonCode"] = contactPerson.PersonCode;
                    dict["PersonName"] = contactPerson.PersonName;
                    list.Add(dict);
                }
            }
            jd.rows = list;
            jd.total = list.Count;
            return jd;
        }

        [WebMethod]
        public JsonData ListMessage(string contactId, int start, int limit)
        {
            JsonData jd = new JsonData();
            var list = new List<SerializableDictionary<string, object>>();
            using (ISession session = NHibernateHelper.OpenSession())
            {
                ICriteria criteria = session.CreateCriteria<LineMessages>()
                                            .Add(Expression.Eq("ContactId", Guid.Parse(contactId)));
                var rowcount = CriteriaTransformer.Clone(criteria).SetProjection(Projections.RowCount());
                criteria.AddOrder(Order.Desc("Timestamp"))
                        .SetFirstResult(start)
                        .SetMaxResults(limit);
                var models = criteria.List<LineMessages>();
                foreach (var model in models)
                {
                    var dict = ObjectToDictionaryHelper.ToDictionary(model);
                    var lineContacts = session.CreateQuery("from LineContacts where LineId=?")
                                            .SetParameter(0, model.SourceUserId).List<LineContacts>();
                    if (lineContacts.Count > 0)
                    {
                        if (model.SourceType == "agent")
                        {
                            var agent = session.Get<Agents>(Guid.Parse(lineContacts[0].LineId));
                            dict["PersonCode"] = "";
                            dict["PersonName"] = agent.AgentName;
                        }
                        else
                        {
                            var contactPerson = session.Get<ContactPersons>(lineContacts[0].ContactPersonId);
                            dict["PersonCode"] = contactPerson.PersonCode;
                            dict["PersonName"] = contactPerson.PersonName;
                        }
                    }
                    list.Add(dict);
                }
                jd.total = rowcount.FutureValue<int>().Value;
            }
            jd.rows = list;
         return jd;
        }


        [WebMethod]
        public string SendText(string contactId, string contactPersonId, string agentId, string text)
        {
            string result = "";
            var roomId = 0;
            var userId = "";
            if (contactPersonId != null)
            {
                using (ISession session = NHibernateHelper.OpenSession())
                {
                    var models = session.CreateQuery("from LineChatRoom where ContactPersonId=? and ActiveFlag='1'")
                                        .SetParameter(0, Guid.Parse(contactPersonId)).List<LineChatRoom>();
                    if (models.Count > 0)
                    {
                        roomId = models[0].Id;
                    }

                    var lineContacts = session.CreateQuery("from LineContacts where ContactPersonId=? and ActiveFlag='1'")
                                        .SetParameter(0, Guid.Parse(contactPersonId)).List<LineContacts>();
                    if (lineContacts.Count > 0)
                    {
                        userId = lineContacts[0].LineId;
                    }
                }
            } else { 
                contactPersonId = "";
            }

            using (var client = new HttpClient())
            {
                var formContent = new FormUrlEncodedContent(new[]
                    {
                    new KeyValuePair<string, string>("contactId", contactId),
                    new KeyValuePair<string, string>("contactPersonId", contactPersonId),
                    new KeyValuePair<string, string>("roomId", roomId.ToString()),
                    new KeyValuePair<string, string>("userId", userId),
                    new KeyValuePair<string, string>("text", text),
                    new KeyValuePair<string, string>("agentId", agentId)
                });
                var response = client.PostAsync(ConfigurationManager.AppSettings["LINE_SERVICE_URL"] + "/contactPushMessage", formContent).Result;

                if (response.IsSuccessStatusCode)
                {
                    result = response.Content.ReadAsStringAsync().Result;
                    //Console.WriteLine(content);
                    // Access variables from the returned JSON object
                    //var appHref = content.links.applications.href;
                } else {
                    result = "{sucess:false , msg : \""+response.Content.ReadAsStringAsync().Result+"\"}";
                }
            }
            return result;
        }

        [WebMethod]
        public void SendImage()
        {
            string result = "";

            var Request = HttpContext.Current.Request;
            System.Collections.Specialized.NameValueCollection parameters = HttpContext.Current.Request.Params;
            HttpPostedFile file = HttpContext.Current.Request.Files["imageFile"];
            //System.Diagnostics.Debug.WriteLine("---" + parameters.Get("requestId"));
            //System.Diagnostics.Debug.WriteLine("---" + file.FileName);
            //System.Diagnostics.Debug.WriteLine("---" + file.ContentLength);
            //System.Diagnostics.Debug.WriteLine("---" + file.ContentType);
            string agentId = parameters.Get("agentId");
            string contactId = parameters.Get("contactId");
            string contactPersonId = parameters.Get("contactPersonId");
            var roomId = 0;
            var userId = "";
            var url = ConfigurationManager.AppSettings["LINE_SERVICE_URL"] + "/contactUpload";
            if (contactPersonId != null)
            {
                url = ConfigurationManager.AppSettings["LINE_SERVICE_URL"] + "/upload";
                using (ISession session = NHibernateHelper.OpenSession())
                {
                    var models = session.CreateQuery("from LineChatRoom where ContactPersonId=? and ActiveFlag='1'")
                                        .SetParameter(0, Guid.Parse(contactPersonId)).List<LineChatRoom>();
                    if (models.Count > 0)
                    {
                        roomId = models[0].Id;
                    }

                    var lineContacts = session.CreateQuery("from LineContacts where ContactPersonId=? and ActiveFlag='1'")
                                        .SetParameter(0, Guid.Parse(contactPersonId)).List<LineContacts>();
                    if (lineContacts.Count > 0)
                    {
                        userId = lineContacts[0].LineId;
                    }
                }
            }
            else
            {
                contactPersonId = "";
            }

            using (var client = new HttpClient())
            {
                MultipartFormDataContent form = new MultipartFormDataContent();
                form.Add(new StringContent(contactId), "contactId");
                form.Add(new StringContent(contactPersonId), "contactPersonId");
                form.Add(new StringContent(roomId.ToString()), "id");
                form.Add(new StringContent(userId), "userId");
                form.Add(new StringContent(agentId), "agentId");
                //client.DefaultRequestHeaders.Add("Authorization", ConfigurationManager.AppSettings["TOKEN"]);
                var stream = file.InputStream;
                var contentStream = new StreamContent(stream);
                contentStream.Headers.ContentDisposition = new ContentDispositionHeaderValue("form-data")
                {
                    Name = "uploadFile",
                    FileName = file.FileName
                };
                form.Add(contentStream , "uploadFile");
                var response = client.PostAsync(url, form).Result;

                if (response.IsSuccessStatusCode)
                {
                    result = response.Content.ReadAsStringAsync().Result;
                    //Console.WriteLine(content);
                    // Access variables from the returned JSON object
                    //var appHref = content.links.applications.href;
                }
                else
                {
                    result = "{sucess:false , msg : \"" + response.Content.ReadAsStringAsync().Result + "\"}";
                }
            }
            Context.Response.Clear();
            Context.Response.ContentType = "text/html";
            Context.Response.Write(result);
            Context.Response.End();
        }
    }
}
