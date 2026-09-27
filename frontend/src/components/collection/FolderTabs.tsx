import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function FolderTabs({
  tab,
  total,
  onTabChange,
  mainContent,
  searchContent,
}: {
  tab: "main" | "search";
  total: number;
  onTabChange: (value: "main" | "search") => void;
  mainContent: React.ReactNode;
  searchContent: React.ReactNode;
}) {
  return (
    <Tabs
      value={tab}
      onValueChange={(value) => {
        onTabChange(value as "main" | "search");
      }}
    >
      <TabsList className="flex-wrap">
        <TabsTrigger value="main">Folder ({total})</TabsTrigger>

        <TabsTrigger value="search">Search cards</TabsTrigger>
      </TabsList>

      <TabsContent value="main" className="mt-6 space-y-6">
        {mainContent}
      </TabsContent>

      <TabsContent value="search" className="mt-6">
        {searchContent}
      </TabsContent>
    </Tabs>
  );
}
