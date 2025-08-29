"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Beef } from "lucide-react";
import { HeartPulse } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Track your food and symptoms
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => router.push("/food_logs/new")}
                className="w-full"
                size="lg"
              >
                <Beef /> Log Food
              </Button>
              <Button
                onClick={() => router.push("/symptoms")}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <HeartPulse /> Log Symptoms
              </Button>
            </CardContent>
          </Card>

          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium text-muted-foreground">
                  Name:{" "}
                </span>
                <span className="text-foreground">
                  {session?.user?.name || "Not provided"}
                </span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  Email:{" "}
                </span>
                <span className="text-foreground">
                  {session?.user?.email || "Not provided"}
                </span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  Member since:{" "}
                </span>
                <span className="text-foreground">
                  {session?.user?.createdAt
                    ? new Date(session.user.createdAt).toLocaleDateString()
                    : "Unknown"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
