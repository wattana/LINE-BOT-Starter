using System;
using System.Text;
using System.Collections.Generic;


namespace Line.WebService.Models {
    
    public class Attachments {
        public virtual int AttachmentId { get; set; }
        public virtual string RelateType { get; set; }
        public virtual System.Nullable<System.Guid> RelateId { get; set; }
        public virtual int RelateId2 { get; set; }
        public virtual string FileName { get; set; }
        public virtual string FileType { get; set; }
        public virtual decimal FileSize { get; set; }
        public virtual string FileDate { get; set; }
        public virtual string OriginalFilename { get; set; }
        public virtual string Description { get; set; }
        public virtual string FolderName { get; set; }
        public virtual string ActiveFlag { get; set; }
        public virtual string CreateDate { get; set; }
        public virtual System.Nullable<System.Guid> CreateBy { get; set; }
        public virtual string UpdateDate { get; set; }
        public virtual System.Nullable<System.Guid> UpdateBy { get; set; }
        public virtual string UseFlag { get; set; }
        public virtual string FileVersion { get; set; }
        public virtual string VisibleFlag { get; set; }
    }
}
