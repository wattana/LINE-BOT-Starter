using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

namespace Line.WebService.Commons
{
    public class JsonData
    {
        public int total;
        public bool success = true;
        public string msg = "";


        [XmlArray("RowXs")]
        [XmlArrayItem("ItemX")]
        public List<SerializableDictionary<string, object>> rows;

        public string refId;
    }
}