using Line.WebService.Commons;
using Line.WebService.Models;
using Line.WebService.Repositories;
using NHibernate;
using NHibernate.Criterion;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

namespace Line.WebService
{
    /// <summary>
    /// Summary description for RequestsService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    // [System.Web.Script.Services.ScriptService]
    public class RequestsService : System.Web.Services.WebService
    {

        [WebMethod]
        public JsonData save(RequestData data)
        {
            if (data.RequestNumber != null & data.RequestNumber != "")
            {
                return updateRequest(data);
            }
            else
            {
                return createRequest(data);
            }
        }

        private JsonData createRequest(RequestData data)
        {
            JsonData jd = new JsonData();
            var jss = new JavaScriptSerializer();
            using (ISession session = NHibernateHelper.OpenSession())
            using (var trans = session.BeginTransaction())
            {
                try
                {
                    var categoryId = Convert.ToInt32(ConfigurationManager.AppSettings["REQUEST_CATAGERY_ID"]);
                    var requestCategory = session.Get<RequestCategories>(categoryId);
                    string openDate = DateTime.Now.ToString(Global.DATE_TIME_FORMAT);
                    var contact = session.Get<Contacts>(data.ContactId);
                    var contactId = contact.ContactId;
                    var LogBy = data.LogBy; // Guid.Parse(ConfigurationManager.AppSettings["DUMMYUSER"]);
                    var agent = session.Get<Agents>(LogBy);
                    Guid LogByGroup = Guid.Empty;
                    string AgentName = "";
                    string AgentGroupName = "";
                    if (agent != null)
                    {
                        LogByGroup = agent.AgentGroupId.GetValueOrDefault();
                        AgentName = agent.AgentName;
                        AgentGroupName = session.Get<AgentGroups>(agent.AgentGroupId).GroupName;
                    }

                    var cultureInfo = Global.THAI_CULTUREINFO;
                    var BookDate = (data.OpenDate != null) ?
                                    DateTime.ParseExact(data.OpenDate, "dd/MM/yyyy", cultureInfo).ToString(Global.DATE_FORMAT) :
                                    openDate;
                    var expireDate = DateTime.Today;
                    var expireDateTxt = expireDate.ToString(Global.DATE_TIME_FORMAT);

                    var prefix = session.CreateQuery("from Prefix where ObjectType=?").SetParameter(0, "R").UniqueResult<Prefix>();
                    int Prefixnum = Convert.ToInt32(prefix.ObjectRunningId);
                    string Prefix = prefix.ObjectRunningId;
                    string ReqPrefix = prefix.ObjectPrefix;
                    string yearnow = DateTime.Today.ToString("yyMM", new System.Globalization.CultureInfo("en-US"));

                    //string shortCode = Convert.ToString(iDbX.ExecuteScalar("SELECT short_code FROM request_categories WHERE req_category_id = " + sReq.category_id));
                    ReqPrefix = ReqPrefix.Trim() + yearnow.Trim() + Prefix.Trim(); //ปีเด
                    Prefixnum += 1;
                    prefix.ObjectRunningId = Prefixnum.ToString().PadLeft(Prefix.Trim().Length, '0');
                    session.Update(prefix);


                    var requests = new Requests
                    {
                        RequestNumber = ReqPrefix,
                        ContactId = contactId,
                        PersonName = data.PersonName,
                        CategoryId = requestCategory.ReqCategoryId,
                        RequestStatus = "N",
                        RequestPriority = "N",
                        AssigneeGroupId = LogByGroup,
                        AssigneeId = agent.AgentId,
                        ContactFeeling = "",
                        ProductId = null,
                        RequestDetail = data.RequestDetail,
                        RequestDetail2 = "",
                        OpenDate = openDate,
                        ExpireFlag = "",
                        LogBy = agent.AgentId,
                        ActiveFlag = "1",
                        ContactClass = "",
                        EscalateRound = 0,
                        ChannelType = "LI",
                        KbNumber = "",
                        FirstClose = "",
                        ReopenDate = "",
                        ReopenReason = "",
                        PolicyNumber = "",
                        LastupdateProgress = "",
                        RequestPhone = "",
                        AlertExpireFlag = "",
                        ViewDate = "",
                        SurveyResult = 0,
                        SurveyNote = "",
                        Corrective = "",
                        Preventive = "",
                        DelayReasonId = 0,
                        UncontrollableFlag = "",
                        ServiceFlag = "",
                        CloseType = 0,
                        OpenTime = "",
                        SurveyDate = "",
                        Open2Date = "",
                        LastupdateAgent = "",
                        LastupdateCust = "",
                        ComplaintStore = 0,
                        CommercialGroup = "",
                        MediaType = 0,
                        MediaName = 0,
                        AssigneeLastView = "",
                        SupCheckFlag = "",
                        SupComment = "",
                        ReserveField1 = "",
                        ReserveFlag1 = "",
                        ReserveField2 = "",
                        ReserverFlag2 = "",
                        FollowFlag = "",
                        ComplaintTo = "",
                        LastEscalateDate = "",
                        ComplaintToName = "",
                        EscalateCount = 0,
                        HiddencustFlag = "",
                        ImpactArea1 = 0,
                        ImpactArea2 = 0,
                        ImpactAreaDetail = ""
                    };
                    var requestId = (Guid)session.Save(requests);

                    string attachmentList = data.AttachmentList; //:["10077","10078"]
                    if (attachmentList != null && attachmentList != "")
                    {
                        Hashtable[] attachs = jss.Deserialize<Hashtable[]>(attachmentList);
                        for (int i = 0; i < attachs.Length; i++)
                        {
                            var attachId = Convert.ToInt32(attachs[i]["id"].ToString());
                            var objAttachment = session.Get<Attachments>(attachId);
                            if (objAttachment.RelateId == null)
                            {
                                objAttachment.RelateId = requestId;
                                objAttachment.Description = attachs[i]["description"].ToString();
                                session.Update(objAttachment);
                            }
                            else
                            {
                                var attachment = new Attachments();
                                attachment.RelateType = objAttachment.RelateType;
                                attachment.RelateId = requestId;
                                attachment.FileName = objAttachment.FileName;
                                attachment.OriginalFilename = objAttachment.OriginalFilename;
                                attachment.FolderName = objAttachment.FolderName;
                                attachment.FileType = objAttachment.FileType;
                                attachment.FileDate = objAttachment.FileDate;
                                attachment.FileSize = objAttachment.FileSize;
                                attachment.Description = objAttachment.Description;
                                attachment.CreateBy = objAttachment.CreateBy;
                                attachment.ActiveFlag = objAttachment.ActiveFlag;
                                jd.refId = session.Save(attachment).ToString();
                            }
                        }
                    }

                    var sReqAct = new RequestActivities();
                    sReqAct.RequestId = requestId;
                    sReqAct.ActivityDetail = Properties.Resources.newRequest + " / " + agent.AgentName; //สร้างใบงานใหม่
                    sReqAct.ActivityType = "CN";
                    sReqAct.ContactFeeling = requests.ContactFeeling;
                    sReqAct.InternalFlag = "1"; //ไม่ต้องการแสดง status ที่ผู้ร้องเรียน
                    sReqAct.ActionBy = LogBy;
                    sReqAct.ActionDate = openDate;
                    sReqAct.RequestStatus = requests.RequestStatus;
                    sReqAct.ProgressId = 0;
                    sReqAct.AckFlag = "";
                    sReqAct.ActiveFlag = "1";
                    sReqAct.ActivityDate = openDate;
                    sReqAct.ActivityPersonName = requests.PersonName;
                    sReqAct.ActivityPriority = requests.RequestPriority;
                    sReqAct.ContactFlow = "";
                    sReqAct.RunningSort = 0;
                    session.Save(sReqAct);

                    trans.Commit();
                    jd.msg = requests.RequestNumber;
                    jd.refId = requests.RequestId.ToString();
                }
                catch (Exception ex)
                {
                    trans.Rollback();
                    jd.success = false;
                    jd.msg = ex.Message;
                }
            }

            return jd;
        }

        private JsonData updateRequest(RequestData data)
        {
            JsonData jd = new JsonData();
            var jss = new JavaScriptSerializer();
            using (ISession session = NHibernateHelper.OpenSession())
            using (var trans = session.BeginTransaction())
            {
                try
                {
                    string openDate = DateTime.Now.ToString(Global.DATE_TIME_FORMAT);
                    var contact = session.Get<Contacts>(data.ContactId);
                    var contactId = contact.ContactId;
                    var LogBy = data.LogBy; // Guid.Parse(ConfigurationManager.AppSettings["DUMMYUSER"]);
                    var agent = session.Get<Agents>(LogBy);
                    Guid LogByGroup = Guid.Empty;
                    string AgentName = "";
                    string AgentGroupName = "";
                    if (agent != null)
                    {
                        LogByGroup = agent.AgentGroupId.GetValueOrDefault();
                        AgentName = agent.AgentName;
                        AgentGroupName = session.Get<AgentGroups>(agent.AgentGroupId).GroupName;
                    }

                    var cultureInfo = Global.THAI_CULTUREINFO;
                    var BookDate = (data.OpenDate != null) ?
                                    DateTime.ParseExact(data.OpenDate, "dd/MM/yyyy", cultureInfo).ToString(Global.DATE_FORMAT) :
                                    openDate;
                    var expireDate = DateTime.Today;
                    var expireDateTxt = expireDate.ToString(Global.DATE_TIME_FORMAT);


                    var requests = session.CreateQuery("from Requests where RequestNumber=?")
                                        .SetParameter(0, data.RequestNumber)
                                        .UniqueResult<Requests>();
                    //requests.RequestDetail = data.RequestDetail;
                    session.SaveOrUpdate(requests);
                    var requestId = requests.RequestId;

                    string attachmentList = data.AttachmentList; //:["10077","10078"]
                    if (attachmentList != null && attachmentList != "")
                    {
                        Hashtable[] attachs = jss.Deserialize<Hashtable[]>(attachmentList);
                        for (int i = 0; i < attachs.Length; i++)
                        {
                            var attachId = Convert.ToInt32(attachs[i]["id"].ToString());
                            var objAttachment = session.Get<Attachments>(attachId);
                            if (objAttachment.RelateId == null)
                            {
                                objAttachment.RelateId = requestId;
                                objAttachment.Description = attachs[i]["description"].ToString();
                                session.Update(objAttachment);
                            }
                            else
                            {
                                var attachment = new Attachments();
                                attachment.RelateType = objAttachment.RelateType;
                                attachment.RelateId = requestId;
                                attachment.FileName = objAttachment.FileName;
                                attachment.OriginalFilename = objAttachment.OriginalFilename;
                                attachment.FolderName = objAttachment.FolderName;
                                attachment.FileType = objAttachment.FileType;
                                attachment.FileDate = objAttachment.FileDate;
                                attachment.FileSize = objAttachment.FileSize;
                                attachment.Description = objAttachment.Description;
                                attachment.CreateBy = objAttachment.CreateBy;
                                attachment.ActiveFlag = objAttachment.ActiveFlag;
                                jd.refId = session.Save(attachment).ToString();
                            }
                        }
                    }

                    var sReqAct = new RequestActivities();
                    sReqAct.RequestId = requestId;
                    sReqAct.ActivityDetail = Properties.Resources.editRequest +" -> "+ data.RequestDetail; //สร้างใบงานใหม่
                    sReqAct.ActivityType = "CN";
                    sReqAct.ContactFeeling = requests.ContactFeeling;
                    sReqAct.InternalFlag = "1"; //ไม่ต้องการแสดง status ที่ผู้ร้องเรียน
                    sReqAct.ActionBy = LogBy;
                    sReqAct.ActionDate = openDate;
                    sReqAct.RequestStatus = requests.RequestStatus;
                    sReqAct.ProgressId = 0;
                    sReqAct.AckFlag = "";
                    sReqAct.ActiveFlag = "1";
                    sReqAct.ActivityDate = openDate;
                    sReqAct.ActivityPersonName = requests.PersonName;
                    sReqAct.ActivityPriority = requests.RequestPriority;
                    sReqAct.ContactFlow = "";
                    sReqAct.RunningSort = 0;
                    session.Save(sReqAct);

                    trans.Commit();
                    jd.msg = requests.RequestNumber;
                    jd.refId = requests.RequestId.ToString();
                }
                catch (Exception ex)
                {
                    trans.Rollback();
                    jd.success = false;
                    jd.msg = ex.Message;
                }
            }

            return jd;
        }

        [WebMethod]
        public JsonData saveAttach(AttachData data, byte[] buffer, long Offset)
        {
            JsonData jd = new JsonData();
            using (ISession session = NHibernateHelper.OpenSession())
            {
                try
                {
                    var now = DateTime.Now.ToString(Global.DATE_TIME_FORMAT);
                    var attachment = new Attachments();
                    attachment.RelateType = "R";
                    attachment.RelateId = null;
                    attachment.RelateId2 = 0;
                    attachment.FileName = data.FileName;
                    attachment.OriginalFilename = data.OriginalFilename;
                    attachment.FolderName = "../uploads/requests/";  //ConfigurationManager.AppSettings["UPLOADPATH"];
                    attachment.FileType = data.FileType;
                    attachment.FileDate = DateTime.Now.ToString(Global.DATE_TIME_FORMAT);
                    attachment.FileSize = data.FileSize;
                    attachment.Description = data.Description;
                    attachment.CreateDate = now;
                    attachment.UpdateDate = "";
                    attachment.UseFlag = "";
                    attachment.FileVersion = "";
                    attachment.ActiveFlag = data.ActiveFlag;
                    attachment.VisibleFlag = "";
                    var attachmentId = (int)session.Save(attachment);
                    jd.refId = attachmentId.ToString();
                    attachment = session.Get<Attachments>(attachmentId);

                    var fileName = attachment.AttachmentId + Path.GetExtension(data.OriginalFilename);
                    // setting the file location to be saved in the server. 
                    // reading from the web.config file 
                    string targetFilePath = System.IO.Path.Combine(ConfigurationManager.AppSettings["UPLOADPATH"], fileName);

                    if (Offset == 0) // new file, create an empty file
                        File.Create(targetFilePath).Close();
                    // open a file stream and write the buffer. 
                    // Don't open with FileMode.Append because the transfer may wish to 
                    // start a different point
                    using (FileStream fs = new FileStream(targetFilePath, FileMode.Open,
                        FileAccess.ReadWrite, FileShare.Read))
                    {
                        fs.Seek(Offset, SeekOrigin.Begin);
                        fs.Write(buffer, 0, buffer.Length);
                    }
                    attachment.FileName = fileName;

                    session.Flush();
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
        public JsonData upload(int attachmentId, byte[] buffer, long Offset)
        {
            JsonData jd = new JsonData();
            using (ISession session = NHibernateHelper.OpenSession())
            {
                try
                {
                    var attachment = session.Get<Attachments>(attachmentId);
                    var fileName = attachment.AttachmentId + "." + attachment.FileType;
                    // setting the file location to be saved in the server. 
                    // reading from the web.config file 
                    string targetFilePath = System.IO.Path.Combine(ConfigurationManager.AppSettings["UPLOADPATH"], fileName);

                    if (Offset == 0) // new file, create an empty file
                        File.Create(targetFilePath).Close();
                    // open a file stream and write the buffer. 
                    // Don't open with FileMode.Append because the transfer may wish to 
                    // start a different point
                    using (FileStream fs = new FileStream(targetFilePath, FileMode.Open,
                        FileAccess.ReadWrite, FileShare.Read))
                    {
                        fs.Seek(Offset, SeekOrigin.Begin);
                        fs.Write(buffer, 0, buffer.Length);
                    }
                    attachment.FileName = fileName;
                    session.Flush();
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
        public JsonData loadRequests(string requestNumber)
        {
            JsonData jd = new JsonData();
            var list = new List<SerializableDictionary<string, object>>();
            using (ISession session = NHibernateHelper.OpenSession())
            {
                var model = session.CreateQuery("from Requests where RequestNumber=?").SetParameter(0, requestNumber).UniqueResult<Requests>();
                if (model != null) {
                    var dict = ObjectToDictionaryHelper.ToDictionary(model);
                    list.Add(dict);
                }
            }
            jd.rows = list;
            return jd;
        }

        [WebMethod]
        public AttachmentData download(int attachmentId)
        {
            AttachmentData jd = new AttachmentData();
            Attachments attachment = null;
            using (ISession session = NHibernateHelper.OpenSession())
            {
                try
                {
                    attachment = session.Get<Attachments>(attachmentId);
                }
                catch (Exception e)
                {
                }

            }
            string filePath = "";
            if (attachment.RelateType == "K")
                filePath = Path.Combine(ConfigurationManager.AppSettings["IMIND_UPLOADPATH"] + "knowledges/", attachment.FileName);
            else if (attachment.FolderName == "../uploads/requests/aero/")
                filePath = Path.Combine(ConfigurationManager.AppSettings["IMIND_UPLOADPATH"]+ "requests/aero/", attachment.FileName);
            else
                filePath = Path.Combine(ConfigurationManager.AppSettings["IMIND_UPLOADPATH"] + "requests/", attachment.FileName);
            if (!File.Exists(filePath))
            {
                filePath = Server.MapPath("no_pictures.jpg");
            }
            jd.bytes = File.ReadAllBytes(filePath);
//                jd.bytes = new byte[fs.Length];
  //              fs.Read(jd.bytes, 0, (int)fs.Length);
            jd.fileName = attachment.OriginalFilename;
            jd.fileType = attachment.FileType;
            return jd;
        }
    }

    public class RequestData
    {
        public System.Guid RequestId { get; set; }
        public string RequestNumber { get; set; }
        public System.Nullable<System.Guid> ContactId { get; set; }
        public string PersonName { get; set; }
        public int CategoryId { get; set; }
        public string RequestStatus { get; set; }
        public string RequestPriority { get; set; }
        public System.Nullable<System.Guid> AssigneeGroupId { get; set; }
        public System.Nullable<System.Guid> AssigneeId { get; set; }
        public string ContactFeeling { get; set; }
        public System.Nullable<System.Guid> ProductId { get; set; }
        public string RequestDetail { get; set; }
        public string RequestDetail2 { get; set; }
        public string OpenDate { get; set; }
        public string ExpireDate { get; set; }
        public string CloseDate { get; set; }
        public System.Nullable<System.Guid> CloseBy { get; set; }
        public string CompleteDate { get; set; }
        public string ExpireFlag { get; set; }
        public System.Nullable<System.Guid> LogBy { get; set; }
        public string ActiveFlag { get; set; }
        public string ContactClass { get; set; }
        public string SurveyRate { get; set; }
        public int EscalateRound { get; set; }
        public string ChannelType { get; set; }
        public string KbNumber { get; set; }
        public string FirstClose { get; set; }
        public string ReopenDate { get; set; }
        public System.Nullable<System.Guid> ReopenBy { get; set; }
        public string ReopenReason { get; set; }
        public string PolicyNumber { get; set; }
        public int? RootCauseId { get; set; }
        public int? ProgressId { get; set; }
        public string LastupdateProgress { get; set; }
        public string RequestPhone { get; set; }
        public System.Nullable<System.Guid> RelateId { get; set; }
        public string AlertExpireFlag { get; set; }
        public System.Nullable<System.Guid> ViewBy { get; set; }
        public string ViewDate { get; set; }
        public int SurveyResult { get; set; }
        public string SurveyNote { get; set; }
        public string Corrective { get; set; }
        public string Preventive { get; set; }
        public int DelayReasonId { get; set; }
        public string UncontrollableFlag { get; set; }
        public string ServiceFlag { get; set; }
        public int CloseType { get; set; }
        public string OpenTime { get; set; }
        public string SurveyDate { get; set; }
        public System.Nullable<System.Guid> SurveyBy { get; set; }
        public string Open2Date { get; set; }
        public System.Nullable<System.Guid> CompleteBy { get; set; }
        public System.Nullable<System.Guid> ChatSessionId { get; set; }
        public string LastupdateAgent { get; set; }
        public string LastupdateCust { get; set; }
        public int ComplaintStore { get; set; }
        public string CommercialGroup { get; set; }
        public int MediaType { get; set; }
        public int MediaName { get; set; }
        public string AssigneeLastView { get; set; }
        public string SupCheckFlag { get; set; }
        public string SupComment { get; set; }
        public string ReserveFlag1 { get; set; }
        public string ReserverFlag2 { get; set; }
        public string ReserveField1 { get; set; }
        public string ReserveField2 { get; set; }
        public string FollowFlag { get; set; }
        public System.Nullable<System.Guid> ComplaintAt { get; set; }
        public string ComplaintTo { get; set; }
        public System.Nullable<System.Guid> ComplaintProduct { get; set; }
        public string LastEscalateDate { get; set; }
        public string ComplaintToName { get; set; }
        public int EscalateCount { get; set; }
        public string HiddencustFlag { get; set; }
        public decimal? PlaceLat { get; set; }
        public decimal? PlaceLng { get; set; }
        public int ImpactArea1 { get; set; }
        public int ImpactArea2 { get; set; }
        public string ImpactAreaDetail { get; set; }
        public string AttachmentList { set; get; }


        public void ExtendedObject(Requests parent)
        {
            foreach (PropertyInfo prop in parent.GetType().GetProperties())
            {
                var field = GetType().GetProperty(prop.Name);
                if (field != null)
                {
                    if (prop.Name != "RequestAero" || prop.Name != "AssigneeGroup")
                        field.SetValue(this, prop.GetValue(parent, null), null);
                }
            }
        }
    }

    public class AttachData
    {
        public int AttachmentId { get; set; }
        public string RelateType { get; set; }
        public System.Nullable<System.Guid> RelateId { get; set; }
        public int RelateId2 { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public decimal FileSize { get; set; }
        public string FileDate { get; set; }
        public string OriginalFilename { get; set; }
        public string Description { get; set; }
        public string FolderName { get; set; }
        public string ActiveFlag { get; set; }
        public string CreateDate { get; set; }
        public System.Nullable<System.Guid> CreateBy { get; set; }
        public string UpdateDate { get; set; }
        public System.Nullable<System.Guid> UpdateBy { get; set; }
        public string UseFlag { get; set; }
        public string FileVersion { get; set; }
        public string VisibleFlag { get; set; }
    }
}
