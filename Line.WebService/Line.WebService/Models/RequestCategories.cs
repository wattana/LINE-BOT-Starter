using System;
using System.Text;
using System.Collections.Generic;


namespace Line.WebService.Models {
    
    public class RequestCategories {
        public virtual int ReqCategoryId { get; set; }
        public virtual string ReqCategoryName { get; set; }
        public virtual string ReqCategoryCode { get; set; }
        public virtual string ActiveFlag { get; set; }
        public virtual string ReqCategoryDetail { get; set; }
        public virtual string RelationCaption { get; set; }
        public virtual string RelationCategory { get; set; }
        public virtual int ParentId { get; set; }
        public virtual string ComplainFlag { get; set; }
        public virtual string HasChild { get; set; }
        public virtual string DefaultStatus { get; set; }
        public virtual string DefaultFeeling { get; set; }
        public virtual System.Nullable<System.Guid> DefaultGroup { get; set; }
        public virtual System.Nullable<System.Guid> DefaultAssignee { get; set; }
        public virtual string ShowOnList { get; set; }
        public virtual short ShowSeq { get; set; }
        public virtual short SlaPeriod { get; set; }
        public virtual string SlaUnit { get; set; }
        public virtual string DefaultFlow { get; set; }
        public virtual int SlaInHour { get; set; }
        public virtual string OftenFlag { get; set; }
        public virtual int DefaultProgress { get; set; }
        public virtual System.Nullable<System.Guid> DefaultKbId { get; set; }
        public virtual string IntraFlag { get; set; }
        public virtual string UpdateDate { get; set; }
        public virtual System.Nullable<System.Guid> UpdateBy { get; set; }
        public virtual System.Nullable<System.Guid> RelateId { get; set; }
        public virtual string InternalFlag { get; set; }
        public virtual int BuId { get; set; }
        public virtual string CustomerGroup { get; set; }
        public virtual decimal? ServiceType { get; set; }
        public virtual decimal? QuestionId { get; set; }
        public virtual string LocationFlag { get; set; }
        public virtual string ProductFlag { get; set; }
        public virtual int? DocumentId { get; set; }
        public virtual string SurveyFlag { get; set; }
        public virtual System.Guid MsreplTranVersion { get; set; }
        public virtual int NotifyDay { get; set; }
    }
}
