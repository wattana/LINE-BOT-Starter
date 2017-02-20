using System;
using System.Collections.Generic;
using System.Configuration;
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
        public string TestSendText(string contactPersonId, String agentId, string text)
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
        public string SendText(string contactId, String agentId, string text)
        {
            string result = "";
            using (var client = new HttpClient())
            {
                var formContent = new FormUrlEncodedContent(new[]
                    {
                    new KeyValuePair<string, string>("contactId", contactId),
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
                    result = response.ToString();
                }
            }
            return result;
        }

        [WebMethod]
        public void sendImage()
        {
            var Request = HttpContext.Current.Request;
            System.Collections.Specialized.NameValueCollection parameters = HttpContext.Current.Request.Params;
            HttpPostedFile file = HttpContext.Current.Request.Files["imageFile"];
            //System.Diagnostics.Debug.WriteLine("---" + parameters.Get("requestId"));
            //System.Diagnostics.Debug.WriteLine("---" + file.FileName);
            //System.Diagnostics.Debug.WriteLine("---" + file.ContentLength);
            //System.Diagnostics.Debug.WriteLine("---" + file.ContentType);
            string agentId = parameters.Get("agentId");
            string contactId = parameters.Get("contactId");

            using (var client = new HttpClient())
            {
                MultipartFormDataContent form = new MultipartFormDataContent();
                form.Add(new StringContent(contactId), "contactId");
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
                var response = client.PostAsync(ConfigurationManager.AppSettings["LINE_SERVICE_URL"] + "/contactUpload",form).Result;

                if (response.IsSuccessStatusCode)
                {
                    dynamic content = response.Content.ReadAsStringAsync().Result;
                    Console.WriteLine(content);
                    // Access variables from the returned JSON object
                    //var appHref = content.links.applications.href;
                }
            }
            Context.Response.Clear();
            Context.Response.ContentType = "text/html";
            Context.Response.Write("ok");
            Context.Response.End();
        }
    }
}
