using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace Line.WebService.Commons
{
    public static class ObjectToDictionaryHelper
    {
        public static SerializableDictionary<string, object> ToDictionary(this object source)
        {
            return source.ToDictionary<object>();
        }

        public static SerializableDictionary<string, T> ToDictionary<T>(this object source)
        {
            if (source == null)
                ThrowExceptionWhenSourceArgumentIsNull();

            var dictionary = new SerializableDictionary<string, T>();
            foreach (PropertyDescriptor property in TypeDescriptor.GetProperties(source))
                AddPropertyToDictionary<T>(property, source, dictionary);
            return dictionary;
        }

        private static void AddPropertyToDictionary<T>(PropertyDescriptor property, object source, Dictionary<string, T> dictionary)
        {
            object value = property.GetValue(source);
            if (IsOfType<T>(value))
            {
                string valueString = null;
                if (value.GetType() == typeof(float)) valueString = Math.Round((float)value, 2, MidpointRounding.AwayFromZero).ToString("R");
                else if (value.GetType() == typeof(double)) valueString = Math.Round((double)value, 2, MidpointRounding.AwayFromZero).ToString("R");
                else valueString = Convert.ToString(value);
                dictionary.Add(property.Name, (T)(object)valueString);
            }
        }

        private static bool IsOfType<T>(object value)
        {
            return value is T;
        }

        private static void ThrowExceptionWhenSourceArgumentIsNull()
        {
            throw new ArgumentNullException("source", "Unable to convert object to a dictionary. The source object is null.");
        }
    }
}