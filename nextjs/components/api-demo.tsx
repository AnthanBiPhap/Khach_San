"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { apiGet, apiPost } from "@/lib/api"

export function ApiDemo() {
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const { toast } = useToast()

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await apiGet<{ data: any[] }>("/users")
      setUsers(response.data)
      toast({
        title: "Thành công",
        description: "Đã tải danh sách người dùng",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách người dùng",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createUser = async () => {
    if (!name || !email) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ thông tin",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await apiPost("/users", { name, email })
      setName("")
      setEmail("")
      fetchUsers() // Refresh list
      toast({
        title: "Thành công",
        description: "Đã tạo người dùng mới",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo người dùng",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Demo - Quản lý người dùng</CardTitle>
          <CardDescription>Demo kết nối API để tạo và hiển thị danh sách người dùng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Tên</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập tên" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={createUser} disabled={loading}>
              {loading ? "Đang tạo..." : "Tạo người dùng"}
            </Button>
            <Button variant="outline" onClick={fetchUsers} disabled={loading}>
              {loading ? "Đang tải..." : "Tải danh sách"}
            </Button>
          </div>

          {users.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Danh sách người dùng:</h3>
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="p-2 border rounded">
                    <p>
                      <strong>{user.name}</strong>
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
