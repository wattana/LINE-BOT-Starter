using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Line.WebService.Repositories;
using NHibernate;
using Line.WebService.Models;
using System.Collections.Generic;

namespace Line.WebService.Tests
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestMethod1()
        {
            using (ISession session = NHibernateHelper.OpenSession())
            {
                ICriteria criteria = session.CreateCriteria<Requests>();
                IList<Requests> list = criteria.List<Requests>();
                var i = 0;
                foreach (var it in list)
                {
                    System.Diagnostics.Debug.WriteLine("Child ::: " + ++i + ". " + it.RequestId);
                }

                var sReqAct = new RequestActivities();
                //sReqAct.RequestActivityId = new Guid();
                sReqAct.RequestId = new Guid();
                sReqAct.ActivityDetail = "สร้างใบงานใหม่"; //สร้างใบงานใหม่
                sReqAct.ActivityType = "CN";
                sReqAct.ContactFeeling = "";
                sReqAct.InternalFlag = "1"; //ไม่ต้องการแสดง status ที่ผู้ร้องเรียน
                sReqAct.ActionBy = new Guid();
                sReqAct.ActionDate = "";
                sReqAct.RequestStatus = "N";
                sReqAct.ProgressId = 0;
                sReqAct.AckFlag = "";
                sReqAct.ActiveFlag = "1";
                sReqAct.ActivityDate = "";
                sReqAct.ActivityPersonName = "PersonName";
                sReqAct.ActivityPriority = "N";
                sReqAct.ContactFlow = "";
                //sReqAct.RunningSort = 0;
                Console.WriteLine("yy--------------");
                session.Save(sReqAct);
                session.Flush();
                Console.WriteLine("rr");
            }
        }
    }
}
