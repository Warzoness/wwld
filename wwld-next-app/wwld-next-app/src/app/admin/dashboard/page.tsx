
import Banner from "@/components/Banner";
import Link from "next/link";

export default function DashboardPage() {
  return (

    <div className="container h-100">
      <Banner />

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quản lý cấu hình</h5>
              <p className="card-text">Setting liên quan đến cấu hình page.</p>
              <Link href="/admin/settings" className="btn btn-primary">Settings</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quản lý thông tin thành phần chính của web</h5>
              <p className="card-text">Quản lý thông tin liên quan đến thành phần chính web</p>
              <Link href="/admin/mainSection-manager" className="btn btn-primary">Settings</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quản lý thông tin liên quan đến nội dung cốt truyện</h5>
              <p className="card-text">Quản lý thông tin liên quan đến nội dung web</p>
              <Link href="/admin/mainSection-manager" className="btn btn-primary">Settings</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quản lý thông tin người dùng</h5>
              <p className="card-text">Quản lý thông tin liên quan đến người dùng và hành vi</p>
              <Link href="/admin/settings" className="btn btn-primary">Settings</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quản lý Feedback</h5>
              <p className="card-text">Quản lý Feedback </p>
              <Link href="/admin/settings" className="btn btn-primary">Settings</Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}