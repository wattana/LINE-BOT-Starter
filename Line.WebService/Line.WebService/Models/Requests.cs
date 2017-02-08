using System;
using System.Text;
using System.Collections.Generic;


namespace Line.WebService.Models {
    
    public class Requests {
        public virtual System.Guid RequestId { get; set; }
        public virtual string RequestNumber { get; set; }
        public virtual System.Nullable<System.Guid> ContactId { get; set; }
        public virtual string PersonName { get; set; }
        public virtual int CategoryId { get; set; }
        public virtual string RequestStatus { get; set; }
        public virtual string RequestPriority { get; set; }
        public virtual System.Nullable<System.Guid> AssigneeGroupId { get; set; }
        public virtual System.Nullable<System.Guid> AssigneeId { get; set; }
        public virtual string ContactFeeling { get; set; }
        public virtual System.Nullable<System.Guid> ProductId { get; set; }
        public virtual string RequestDetail { get; set; }
        public virtual string RequestDetail2 { get; set; }
        public virtual string OpenDate { get; set; }
        public virtual string ExpireDate { get; set; }
        public virtual string CloseDate { get; set; }
        public virtual System.Nullable<System.Guid> CloseBy { get; set; }
        public virtual string CompleteDate { get; set; }
        public virtual string ExpireFlag { get; set; }
        public virtual System.Nullable<System.Guid> LogBy { get; set; }
        public virtual string ActiveFlag { get; set; }
        public virtual string ContactClass { get; set; }
        public virtual string SurveyRate { get; set; }
        public virtual int EscalateRound { get; set; }
        public virtual string ChannelType { get; set; }
        public virtual string KbNumber { get; set; }
        public virtual string FirstClose { get; set; }
        public virtual string ReopenDate { get; set; }
        public virtual System.Nullable<System.Guid> ReopenBy { get; set; }
        public virtual string ReopenReason { get; set; }
        public virtual string PolicyNumber { get; set; }
        public virtual int? RootCauseId { get; set; }
        public virtual int? ProgressId { get; set; }
        public virtual string LastupdateProgress { get; set; }
        public virtual string RequestPhone { get; set; }
        public virtual System.Nullable<System.Guid> RelateId { get; set; }
        public virtual string AlertExpireFlag { get; set; }
        public virtual System.Nullable<System.Guid> ViewBy { get; set; }
        public virtual string ViewDate { get; set; }
        public virtual int SurveyResult { get; set; }
        public virtual string SurveyNote { get; set; }
        public virtual string Corrective { get; set; }
        public virtual string Preventive { get; set; }
        public virtual int DelayReasonId { get; set; }
        public virtual string UncontrollableFlag { get; set; }
        public virtual string ServiceFlag { get; set; }
        public virtual int CloseType { get; set; }
        public virtual string OpenTime { get; set; }
        public virtual string SurveyDate { get; set; }
        public virtual System.Nullable<System.Guid> SurveyBy { get; set; }
        public virtual string Open2Date { get; set; }
        public virtual System.Nullable<System.Guid> CompleteBy { get; set; }
        public virtual System.Nullable<System.Guid> ChatSessionId { get; set; }
        public virtual string LastupdateAgent { get; set; }
        public virtual string LastupdateCust { get; set; }
        public virtual int ComplaintStore { get; set; }
        public virtual string CommercialGroup { get; set; }
        public virtual int MediaType { get; set; }
        public virtual int MediaName { get; set; }
        public virtual string AssigneeLastView { get; set; }
        public virtual string SupCheckFlag { get; set; }
        public virtual string SupComment { get; set; }
        public virtual string ReserveFlag1 { get; set; }
        public virtual string ReserverFlag2 { get; set; }
        public virtual string ReserveField1 { get; set; }
        public virtual string ReserveField2 { get; set; }
        public virtual string FollowFlag { get; set; }
        public virtual System.Nullable<System.Guid> ComplaintAt { get; set; }
        public virtual string ComplaintTo { get; set; }
        public virtual System.Nullable<System.Guid> ComplaintProduct { get; set; }
        public virtual string LastEscalateDate { get; set; }
        public virtual string ComplaintToName { get; set; }
        public virtual int EscalateCount { get; set; }
        public virtual string HiddencustFlag { get; set; }
        public virtual decimal? PlaceLat { get; set; }
        public virtual decimal? PlaceLng { get; set; }
        public virtual int ImpactArea1 { get; set; }
        public virtual int ImpactArea2 { get; set; }
        public virtual string ImpactAreaDetail { get; set; }
    }
}
