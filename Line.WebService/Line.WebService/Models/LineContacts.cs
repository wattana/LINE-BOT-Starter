using System;
using System.Text;
using System.Collections.Generic;


namespace Line.WebService.Models {
    
    public class LineContacts {
        public virtual int Id { get; set; }
        public virtual System.Nullable<System.Guid> ContactId { get; set; }
        public virtual System.Nullable<System.Guid> ContactPersonId { get; set; }
        public virtual string LineId { get; set; }
        public virtual string LineName { get; set; }
        public virtual string SourceType { get; set; }
        public virtual string StatusMessage { get; set; }
        public virtual string PictureUrl { get; set; }
        public virtual string ActiveFlag { get; set; }
        public virtual long? JoinDate { get; set; }
        public virtual System.Nullable<System.Guid> InviteBy { get; set; }
        public virtual long? InviteDate { get; set; }
        public virtual long? LeaveDate { get; set; }
    }
}
