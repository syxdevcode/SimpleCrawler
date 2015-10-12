/******************************************************************

* Copyright (C): ***公司

* CLR版本: 4.0.30319.34011

* 命名空间名称: CnblogsArticlesDownLoad

* 文件名: Singleton

* GUID1: 7c9873e7-a590-4035-b8a9-e9abe5809619

* 创建时间: 2015/9/13 19:04:30

******************************************************************/

using System;
using System.Linq;
using System.Reflection;
using System.Threading;

namespace CnblogsArticlesDownLoad
{
    /// <summary>
    /// 单例模式---测试
    /// </summary>
    public abstract class Singleton<T>
    {
        private static readonly Lazy<T> _instance
          = new Lazy<T>(() =>
          {
              var ctors = typeof(T).GetConstructors(
                  BindingFlags.Instance
                  | BindingFlags.NonPublic
                  | BindingFlags.Public);
              if (ctors.Count() != 1)
                  throw new InvalidOperationException(String.Format("Type {0} must have exactly one constructor.", typeof(T)));
              var ctor = ctors.SingleOrDefault(c => c.GetParameters().Count() == 0 && c.IsPrivate);
              if (ctor == null)
                  throw new InvalidOperationException(String.Format("The constructor for {0} must be private and take no parameters.", typeof(T)));
              return (T)ctor.Invoke(null);
          });

        public static T Instance
        {
            get { return _instance.Value; }
        }
    }

    public class MySingleton : Singleton<MySingleton>
    {
        private int _counter;

        public int Counter
        {
            get { return _counter; }
        }

        private MySingleton()
        {
            _counter = 0;
        }

        public void IncrementCounter()
        {
            Interlocked.Increment(ref _counter);
        }
    }
}