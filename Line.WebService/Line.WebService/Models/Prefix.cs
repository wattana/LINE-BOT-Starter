using System;
using System.Text;
using System.Collections.Generic;


namespace Line.WebService.Models {
    
    public class Prefix {
        public virtual int PrefixId { get; set; }
        public virtual string ObjectType { get; set; }
        public virtual string ObjectPrefix { get; set; }
        public virtual string ObjectRunningId { get; set; }
        public virtual string UpdateDate { get; set; }
        public virtual System.Nullable<System.Guid> UpdateBy { get; set; }
        public virtual string PeriodFlag { get; set; }
    }
}
