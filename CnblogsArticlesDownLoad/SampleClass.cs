/******************************************************************

* Copyright (C): ***公司

* CLR版本: 4.0.30319.34011

* 命名空间名称: CnblogsArticlesDownLoad

* 文件名: SampleClass

* GUID1: 5097302a-bf45-43a0-8884-c36d39767304

* 创建时间: 2015/9/7 17:04:24

******************************************************************/

using System;
using System.Runtime.InteropServices;

namespace CnblogsArticlesDownLoad
{
    /// <summary>
    ///
    /// </summary>
    public class SampleClass : IDisposable
    {
        //演示创建一个非托管资源
        private IntPtr nativeResource = Marshal.AllocHGlobal(100);

        //演示创建一个托管资源
        //private AnotherResource managedResource = new AnotherResource();
        private bool disposed = false;

        ///<summary>
        /// 实现IDisposable中的Dispose方法
        ///</summary>
        public void Dispose()
        {
            //必须为true
            Dispose(true);
            //通知垃圾回收机制不再调用终结器（析构器）
            GC.SuppressFinalize(this);
        }

        ///<summary>
        /// 不是必要的，提供一个Close方法仅仅是为了更符合其他语言（如C++）的规范
        ///</summary>
        public void Close()
        {
            Dispose();
        }

        ///<summary>
        /// 必须，以备程序员忘记了显式调用Dispose方法
        ///</summary>
        ~SampleClass()
        {
            //必须为false
            Dispose(false);
        }

        ///<summary>
        /// 非密封类修饰用protected virtual
        /// 密封类修饰用private
        ///</summary>
        ///<param name="disposing"></param>
        protected virtual void Dispose(bool disposing)
        {
            if (disposed)
            {
                return;
            }
            if (disposing)
            {
                // 清理托管资源
                //if (managedResource != null)
                //{
                //managedResource.Dispose();
                //managedResource = null;
                //}
            }
            // 清理非托管资源
            if (nativeResource != IntPtr.Zero)
            {
                Marshal.FreeHGlobal(nativeResource);
                nativeResource = IntPtr.Zero;
            }
            //让类型知道自己已经被释放
            disposed = true;
        }

        public void SamplePublicMethod()
        {
            if (disposed)
            {
                throw new ObjectDisposedException("SampleClass", "SampleClass is disposed");
            }
            //省略
        }
    }
}