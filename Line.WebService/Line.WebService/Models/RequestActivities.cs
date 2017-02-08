using System;
using System.Text;
using System.Collections.Generic;


namespace Line.WebService.Models {
    
    public class RequestActivities {
        public virtual System.Guid RequestActivityId { get; set; }
        public virtual System.Guid RequestId { get; set; }
        public virtual string ActivityDate { get; set; }
        public virtual string ActivityType { get; set; }
        public virtual System.Nullable<System.Guid> ActionBy { get; set; }
        public virtual string ActionDate { get; set; }
        public virtual string ActivityDetail { get; set; }
        public virtual string ContactFeeling { get; set; }
        public virtual string AckFlag { get; set; }
        public virtual string ContactFlow { get; set; }
        public virtual string ActiveFlag { get; set; }
        public virtual string ActivityPersonName { get; set; }
        public virtual string ActivityPriority { get; set; }
        public virtual string RequestStatus { get; set; }
        public virtual int ProgressId { get; set; }
        public virtual int RunningSort { get; set; }
        public virtual string InternalFlag { get; set; }
    }
}
