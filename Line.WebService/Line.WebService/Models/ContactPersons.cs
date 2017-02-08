using System;
using System.Text;
using System.Collections.Generic;


namespace Line.WebService.Models {
    
    public class ContactPersons {
        public virtual System.Guid ContactPersonId { get; set; }
        public virtual System.Nullable<System.Guid> ContactId { get; set; }
        public virtual string PersonName { get; set; }
        public virtual string DepartmentName { get; set; }
        public virtual string PositionName { get; set; }
        public virtual string PersonNote { get; set; }
        public virtual string ShowNote { get; set; }
        public virtual string ShowSeq { get; set; }
        public virtual string PreferChannel { get; set; }
        public virtual string EmailAddr { get; set; }
        public virtual string ActiveFlag { get; set; }
        public virtual string ContactPersonImg { get; set; }
        public virtual string UpdateDate { get; set; }
        public virtual System.Nullable<System.Guid> UpdateBy { get; set; }
        public virtual string DefaultFlag { get; set; }
        public virtual string PersonCode { get; set; }
        public virtual string PersonAdd1 { get; set; }
        public virtual string PersonPhone { get; set; }
        public virtual string PhoneText { get; set; }
        public virtual System.Nullable<System.Guid> AgentId { get; set; }
        public virtual string EmpId { get; set; }
        public virtual int CompId { get; set; }
        public virtual string LineId { get; set; }
        public virtual string LineName { get; set; }
        public virtual string LineInvite { get; set; }
        public virtual string LineJoin { get; set; }
        public virtual string FbId { get; set; }
        public virtual string FbName { get; set; }
        public virtual string FbInvite { get; set; }
        public virtual string FbJoin { get; set; }
        public virtual string TwId { get; set; }
        public virtual string TwName { get; set; }
        public virtual string TwInvite { get; set; }
        public virtual string TwJoin { get; set; }
    }
}
