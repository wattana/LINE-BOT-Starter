using System;
using System.Text;
using System.Collections.Generic;


namespace Line.WebService.Models {
    
    public class LineChatRoom {
        public virtual int Id { get; set; }
        public virtual string UserId { get; set; }
        public virtual System.Nullable<System.Guid> ContactId { get; set; }
        public virtual System.Nullable<System.Guid> ContactPersonId { get; set; }
        public virtual string DisplayName { get; set; }
        public virtual string PictureUrl { get; set; }
        public virtual string StatusMessage { get; set; }
        public virtual string SourceType { get; set; }
        public virtual string MessageType { get; set; }
        public virtual string Message { get; set; }
        public virtual int Unread { get; set; }
        public virtual long? CreateTime { get; set; }
        public virtual long? UpdateTime { get; set; }
        public virtual string ActiveFlag { get; set; }
    }
}
