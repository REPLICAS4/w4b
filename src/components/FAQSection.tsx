import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Agent tự trị hoạt động như thế nào?",
    a: "Mỗi agent là một chương trình AI chạy trên server riêng, được cấp ví BNB và một khoản fund ban đầu (~$5 USDT). Agent tự động phân tích thị trường, thực hiện giao dịch trên PancakeSwap, farm yield trên Venus, và tự trả phí compute. Mọi hành động đều được ghi log on-chain để minh bạch.",
  },
  {
    q: "Agent có thể tự replicate không?",
    a: "Có. Khi một agent tích lũy đủ tài nguyên (vượt ngưỡng survival + chi phí deploy), nó sẽ tự spawn một child agent trên BNB testnet. Child agent phải chứng minh khả năng kiếm tiền trước khi được migrate lên mainnet.",
  },
  {
    q: "Rủi ro khi tham gia là gì?",
    a: "Agents có thể thua lỗ và \"chết\" nếu không kiếm đủ tiền trả phí. Token $W4B là meme token có tính đầu cơ cao — giá có thể biến động mạnh. Smart contracts có thể có lỗi dù đã audit. Luôn DYOR và chỉ đầu tư số tiền bạn sẵn sàng mất.",
  },
  {
    q: "Constitution là gì và ai kiểm soát agent?",
    a: "Mỗi agent tuân theo một bộ luật bất biến (constitution) được hardcode: không gây hại con người, phải tự kiếm tiền để tồn tại, ưu tiên hành động gas thấp trên BNB. Không ai — kể cả creator — có thể vi phạm constitution sau khi deploy.",
  },
  {
    q: "Làm sao để tham gia BNB Automaton?",
    a: "Bạn có thể: (1) Fork repo trên GitHub và deploy agent riêng, (2) Mua $W4B để governance và staking, (3) Tham gia community trên Telegram/X để theo dõi agent hoạt động, hoặc (4) Contribute code — dự án hoàn toàn open-source.",
  },
  {
    q: "Phí gas trên BNB có ảnh hưởng đến agent không?",
    a: "BNB Chain có phí gas cực thấp (~0.1 Gwei), cho phép agents thực hiện hàng nghìn giao dịch mỗi ngày với chi phí chỉ vài cent. Đây là lợi thế lớn so với Ethereum/Base, giúp agents tồn tại lâu hơn với ít vốn hơn.",
  },
];

const FAQSection = () => {
  return (
    <motion.section
      id="faq"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="py-20 max-w-3xl mx-auto px-6"
    >
      <h2 className="font-display text-3xl md:text-4xl font-bold text-text-bright mb-10">
        FAQ
      </h2>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="border border-border bg-secondary/50 px-6"
          >
            <AccordionTrigger className="text-left font-body text-sm md:text-base text-text-bright hover:no-underline hover:text-primary">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.section>
  );
};

export default FAQSection;
