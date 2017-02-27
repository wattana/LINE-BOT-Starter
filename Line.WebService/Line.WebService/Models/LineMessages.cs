using System;
using System.Text;
using System.Collections.Generic;


namespace Line.WebService.Models {
    
    public class LineMessages {
        public virtual int Id { get; set; }
        public virtual int? RoomId { get; set; }
        public virtual string ReplyToken { get; set; }
        public virtual string EventType { get; set; }
        public virtual long? Timestamp { get; set; }
        public virtual System.Nullable<System.Guid> ContactId { get; set; }
        public virtual string SourceType { get; set; }
        public virtual string SourceUserId { get; set; }
        public virtual string MessageId { get; set; }
        public virtual string MessageType { get; set; }
        public virtual string MessageText { get; set; }
        public virtual int? StickerId { get; set; }
        public virtual int? PackageId { get; set; }
        public virtual string Title { get; set; }
        public virtual string Address { get; set; }
        public virtual string Latitude { get; set; }
        public virtual string Longitude { get; set; }
        public virtual string FilePath { get; set; }
        public virtual string FileName { get; set; }
        public virtual string OriginalFileName { get; set; }
        public virtual string RequestNumber { get; set; }
        public virtual string Info { get; set; }
    }
}
