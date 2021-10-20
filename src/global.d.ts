interface ITool {
  name: string;
  title?: string;
  icon?: any;
  tools?: (ITool | null)[];
}

interface IToolGroup {
  name: string;
  title: string;
  tools: ITool[];
}

export {};
