using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Line.WebService.Commons
{
    public class AttachmentData
    {
        public int total;
        public bool success = true;
        public string fileName = "";
        public string fileType = "";
        public byte[] bytes;
    }
}