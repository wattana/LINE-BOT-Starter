using System;
using System.Text;
using System.Collections.Generic;


namespace Line.WebService.Models {
    
    public class AgentGroups {
        public virtual System.Guid GroupId { get; set; }
        public virtual string ActiveFlag { get; set; }
        public virtual string GroupName { get; set; }
        public virtual System.Nullable<System.Guid> GroupManager { get; set; }
        public virtual System.Nullable<System.Guid> GroupLeader { get; set; }
        public virtual System.Nullable<System.Guid> GroupDefaultPerson { get; set; }
        public virtual int ReqCategoryId { get; set; }
        public virtual int TeamId { get; set; }
        public virtual string MenuPermission { get; set; }
        public virtual string EditPermission { get; set; }
        public virtual string ShowOnList { get; set; }
        public virtual string UpdateDate { get; set; }
        public virtual System.Nullable<System.Guid> UpdateBy { get; set; }
        public virtual string SaleFlag { get; set; }
        public virtual string ShortName { get; set; }
    }
}
