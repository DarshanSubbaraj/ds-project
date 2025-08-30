import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { 
  ArrowLeft, 
  Download, 
  Moon, 
  Sun, 
  User, 
  Mail, 
  LogOut,
  FileText,
  Database,
  Palette,
  Shield
} from 'lucide-react';
import { Screen } from '../App';

interface SettingsScreenProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  onNavigate: (screen: Screen) => void;
}

export function SettingsScreen({ theme, onThemeChange, onNavigate }: SettingsScreenProps) {
  const [userInfo, setUserInfo] = useState({
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    joinDate: '2024-01-15'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState(userInfo);

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    onThemeChange(newTheme);
    toast.success(`Switched to ${newTheme} mode`);
  };

  const handleExportData = (type: 'csv' | 'predictions') => {
    // Mock export functionality
    const filename = type === 'csv' ? 'stock_data.csv' : 'predictions.csv';
    toast.success(`${filename} export started`);
    
    // In a real app, this would trigger actual file download
    setTimeout(() => {
      toast.success(`${filename} downloaded successfully`);
    }, 2000);
  };

  const handleSaveProfile = () => {
    setUserInfo(editedInfo);
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    // In a real app, this would handle logout logic
    setTimeout(() => {
      onNavigate('input');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => onNavigate('dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-muted-foreground">Customize your dashboard experience</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5" />
              <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>
              Manage your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="" />
                <AvatarFallback className="text-lg">
                  {userInfo.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <Badge variant="secondary">Learning Mode</Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  Member since {new Date(userInfo.joinDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div>
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editedInfo.name}
                    onChange={(e) => setEditedInfo({...editedInfo, name: e.target.value})}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 p-2 bg-muted rounded">{userInfo.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editedInfo.email}
                    onChange={(e) => setEditedInfo({...editedInfo, email: e.target.value})}
                    className="mt-1"
                  />
                ) : (
                  <div className="mt-1 p-2 bg-muted rounded flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {userInfo.email}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSaveProfile}>
                    Save Changes
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>

            <Separator />

            <Button variant="destructive" size="sm" onClick={handleLogout} className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5" />
                <CardTitle>Appearance</CardTitle>
              </div>
              <CardDescription>
                Customize the look and feel of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  <div>
                    <Label htmlFor="theme-toggle">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark themes
                    </p>
                  </div>
                </div>
                <Switch
                  id="theme-toggle"
                  checked={theme === 'dark'}
                  onCheckedChange={handleThemeToggle}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Export Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5" />
                <CardTitle>Data Export</CardTitle>
              </div>
              <CardDescription>
                Download your stock data and predictions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Historical Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Export stock prices, volumes, and technical indicators
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleExportData('csv')}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export as CSV
                  </Button>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">ML Predictions</h4>
                  <p className="text-sm text-muted-foreground">
                    Export model predictions and accuracy metrics
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleExportData('predictions')}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Predictions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Resources */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                <CardTitle>Learning Resources</CardTitle>
              </div>
              <CardDescription>
                Additional materials to enhance your understanding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" size="sm" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Stock Analysis Guide</div>
                    <div className="text-sm text-muted-foreground">
                      Learn fundamentals of stock analysis
                    </div>
                  </div>
                </Button>

                <Button variant="outline" size="sm" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">ML for Finance</div>
                    <div className="text-sm text-muted-foreground">
                      Understanding machine learning in trading
                    </div>
                  </div>
                </Button>

                <Button variant="outline" size="sm" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Risk Management</div>
                    <div className="text-sm text-muted-foreground">
                      Learn about investment risks
                    </div>
                  </div>
                </Button>

                <Button variant="outline" size="sm" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Technical Indicators</div>
                    <div className="text-sm text-muted-foreground">
                      Master common trading indicators
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5" />
                <CardTitle>Privacy & Security</CardTitle>
              </div>
              <CardDescription>
                Manage your data and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Data Collection</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow anonymous usage analytics
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new features
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Save Analysis History</Label>
                    <p className="text-sm text-muted-foreground">
                      Keep record of your previous analyses
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button variant="outline" size="sm">
                  View Privacy Policy
                </Button>
                <Button variant="outline" size="sm">
                  Download My Data
                </Button>
                <Button variant="destructive" size="sm">
                  Delete My Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}