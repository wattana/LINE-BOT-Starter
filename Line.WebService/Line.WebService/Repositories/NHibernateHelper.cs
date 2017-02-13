using Line.WebService.Models;
using NHibernate;
using NHibernate.Cfg;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Line.WebService.Repositories
{
    public class NHibernateHelper
    {
        private static ISessionFactory _sessionFactory;
        public static bool create = false;

        private static ISessionFactory SessionFactory
        {
            get
            {
                if (_sessionFactory == null)
                {
                    var configuration = new Configuration();
                    configuration.Configure();
                    configuration.AddAssembly(typeof(Line.WebService.Models.Requests).Assembly);
                    _sessionFactory = configuration.BuildSessionFactory();
                }
                return _sessionFactory;
            }
        }

        public static ISession OpenSession()
        {
            return SessionFactory.OpenSession();
        }
        public static void Close()
        {
            SessionFactory.Close();
        }
        public static void initApplication()
        {
            using (ISession session = NHibernateHelper.OpenSession())
            {
            /*
                ICriteria criteria = session.CreateCriteria<Requests>();
                IList<Requests> list = criteria.List<Requests>();
                var i = 0;
                foreach (var it in list)
                {
                    System.Diagnostics.Debug.WriteLine("Child ::: " + ++i + ". " + it.RequestId);
                }
                */
            }
        }
    }
}