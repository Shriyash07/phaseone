import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 font-headline">Settings</h1>
      <Card className="bg-card/30 backdrop-blur-xl border-white/5">
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Settings page is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
