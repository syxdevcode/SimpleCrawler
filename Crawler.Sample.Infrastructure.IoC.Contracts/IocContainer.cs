using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;

namespace Crawler.Sample.Infrastructure.IoC.Contracts
{
    public class IocContainer
    {
        public static UnityContainer Default = new UnityContainer();
    }
}
