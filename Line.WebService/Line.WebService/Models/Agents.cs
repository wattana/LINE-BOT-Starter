using System;
using System.Text;
using System.Collections.Generic;


namespace Line.WebService.Models {
    
    public class Agents {
        public virtual System.Guid AgentId { get; set; }
        public virtual string ActiveFlag { get; set; }
        public virtual System.Nullable<System.Guid> AgentGroupId { get; set; }
        public virtual string AgentName { get; set; }
        public virtual string DepartmentName { get; set; }
        public virtual int DepartmentId { get; set; }
        public virtual string PositionName { get; set; }
        public virtual string Phone { get; set; }
        public virtual string Fax { get; set; }
        public virtual string Mobile { get; set; }
        public virtual string Email { get; set; }
        public virtual string UserId { get; set; }
        public virtual string UserPwd { get; set; }
        public virtual string DataLevel { get; set; }
        public virtual int ViewId { get; set; }
        public virtual string DataPeriod { get; set; }
        public virtual string AgentNote { get; set; }
        public virtual string ShowOnList { get; set; }
        public virtual string ShortName { get; set; }
        public virtual string Extension { get; set; }
        public virtual string AgentImg { get; set; }
        public virtual string CategoryId { get; set; }
        public virtual string UpdateDate { get; set; }
        public virtual System.Nullable<System.Guid> UpdateBy { get; set; }
        public virtual string ReportPermission { get; set; }
        public virtual string FlagClose { get; set; }
        public virtual string FlagComplete { get; set; }
        public virtual string AdminPermission { get; set; }
        public virtual string ChatRoom { get; set; }
        public virtual int BuId { get; set; }
        public virtual string FlagFollowup { get; set; }
        public virtual string ImportLock { get; set; }
        public virtual string ImportStatus { get; set; }
        public virtual string Mantype { get; set; }
        public virtual string Mansalecode { get; set; }
        public virtual string SupervisorFlag { get; set; }
        public virtual byte[] Signature { get; set; }
        public virtual int ThailandPostUserId { get; set; }
        public virtual string HiddencustFlag { get; set; }
        public virtual string DeptDataLevel { get; set; }
        public virtual int DeptViewId { get; set; }
    }
}
