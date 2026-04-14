import Link from "next/link";
import {
  BookOpen, Cpu, Microscope, Calculator,
  ArrowRight, CheckCircle2, Star, Zap, Users, Trophy,
  ChevronRight, GraduationCap, MessageSquare, Clock, Shield
} from "lucide-react";

const areas = [
  {
    id: "humanas",
    label: "Humanas",
    icon: BookOpen,
    color: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-500/20 hover:border-amber-500/40",
    iconColor: "text-amber-400",
    desc: "História, Filosofia, Sociologia, Direito, Psicologia",
    count: "128 orientadores",
  },
  {
    id: "exatas",
    label: "Exatas",
    icon: Calculator,
    color: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/20 hover:border-blue-500/40",
    iconColor: "text-blue-400",
    desc: "Matemática, Física, Química, Engenharia, Estatística",
    count: "214 orientadores",
  },
  {
    id: "biologica",
    label: "Biológicas",
    icon: Microscope,
    color: "from-green-500/20 to-emerald-500/10",
    border: "border-green-500/20 hover:border-green-500/40",
    iconColor: "text-green-400",
    desc: "Medicina, Biologia, Farmácia, Nutrição, Enfermagem",
    count: "187 orientadores",
  },
  {
    id: "tecnologia",
    label: "Tecnologia",
    icon: Cpu,
    color: "from-purple-500/20 to-violet-500/10",
    border: "border-purple-500/20 hover:border-purple-500/40",
    iconColor: "text-purple-400",
    desc: "TI, Programação, Sistemas, IA, Segurança da Informação",
    count: "302 orientadores",
  },
];

const steps = [
  {
    n: "01",
    title: "Publique sua missão",
    desc: "Descreva seu projeto — TCC, monografia, artigo — com prazo e orçamento. Leva menos de 2 minutos.",
    icon: Zap,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    n: "02",
    title: "Escolha seu orientador",
    desc: "Receba propostas de especialistas qualificados na sua área. Veja perfis, avaliações e escolha o melhor.",
    icon: Users,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  {
    n: "03",
    title: "Evolua com garantia",
    desc: "Converse em tempo real, acompanhe o progresso e receba seu trabalho com qualidade garantida.",
    icon: Trophy,
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
  },
];

const testimonials = [
  {
    name: "Ana Beatriz M.",
    course: "Medicina — USP",
    text: "Meu TCC estava travado faz 3 meses. Em 2 semanas com meu orientador no NEO HUB, terminei a revisão bibliográfica inteira. Incrível.",
    rating: 5,
    avatar: "A",
    color: "bg-blue-600",
  },
  {
    name: "Rafael Torres",
    course: "Engenharia Civil — UNICAMP",
    text: "A qualidade dos orientadores é absurda. Meu resultado no TCC foi 9.8. O chat em tempo real foi essencial pro processo.",
    rating: 5,
    avatar: "R",
    color: "bg-purple-600",
  },
  {
    name: "Camila Duarte",
    course: "Direito — PUC-SP",
    text: "Nunca pensei que encontraria um orientador tão alinhado com minha área em tão pouco tempo. Recomendo demais!",
    rating: 5,
    avatar: "C",
    color: "bg-green-600",
  },
  {
    name: "Lucas Ferreira",
    course: "Ciência da Computação — UFMG",
    text: "The platform is incredible. My project proposal got approved in record time because my advisor really knew the area.",
    rating: 5,
    avatar: "L",
    color: "bg-orange-600",
  },
];

const diferenciais = [
  { icon: MessageSquare, title: "Chat em tempo real", desc: "Converse com seu orientador diretamente pela plataforma, sem intermediários." },
  { icon: Shield, title: "Garantia de qualidade", desc: "Todo projeto tem acompanhamento até a entrega final. Satisfação garantida." },
  { icon: Clock, title: "Resposta em até 24h", desc: "Orientadores comprometidos com prazos. Sem sumiço, sem enrolação." },
  { icon: GraduationCap, title: "Especialistas verificados", desc: "Todos os orientadores são validados com comprovação de formação e experiência." },
];

export default function HomePage() {
  return (
    <main className="neo-bg min-h-screen text-white overflow-x-hidden">
      {/* ─── NAV ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-white/5 neo-glass">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm font-black shadow-lg shadow-blue-600/30 group-hover:shadow-blue-600/50 transition">
              N
            </div>
            <span className="font-black tracking-wider text-base">
              NEO{" "}
              <span className="gradient-text-blue italic">HUB</span>
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#como-funciona" className="hover:text-white transition">Como funciona</a>
            <a href="#areas" className="hover:text-white transition">Áreas</a>
            <a href="#depoimentos" className="hover:text-white transition">Depoimentos</a>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="neo-btn-ghost text-sm py-2 px-4">
              Entrar
            </Link>
            <Link href="/cadastro" className="neo-btn-primary text-sm py-2 px-5">
              Começar grátis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-20">
        {/* Badge */}
        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300 tracking-widest mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          SISTEMA DE EVOLUÇÃO ACADÊMICA
        </div>

        <h1 className="animate-fade-up-2 text-5xl md:text-7xl font-black leading-[0.95] tracking-tight max-w-4xl mb-6">
          A EVOLUÇÃO <br />
          É{" "}
          <span className="gradient-text">ORIENTADA</span>
          <span className="text-blue-500">.</span>
        </h1>

        <p className="animate-fade-up-3 text-lg md:text-xl text-white/55 max-w-xl leading-relaxed mb-10">
          Conectamos alunos com orientadores especializados para TCC, monografias
          e artigos científicos. Mais rápido, mais inteligente, com resultado garantido.
        </p>

        <div className="animate-fade-up-4 flex flex-wrap items-center gap-4 mb-16">
          <Link href="/cadastro" className="neo-btn-primary text-base px-7 py-3.5">
            Publicar minha missão <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/login" className="neo-btn-ghost text-base px-7 py-3.5">
            Já tenho conta
          </Link>
        </div>

        {/* Stats */}
        <div className="animate-fade-in grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "+831", label: "Missões concluídas" },
            { value: "+700", label: "Orientadores ativos" },
            { value: "4.9★", label: "Avaliação média" },
            { value: "24h", label: "Tempo de resposta" },
          ].map((stat) => (
            <div key={stat.label} className="neo-card p-4 text-center">
              <div className="text-2xl font-black gradient-text-blue">{stat.value}</div>
              <div className="text-xs text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── COMO FUNCIONA ────────────────────────────────────── */}
      <section id="como-funciona" className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/60 tracking-widest mb-4">
              SIMPLES ASSIM
            </div>
            <h2 className="text-4xl md:text-5xl font-black">
              Como{" "}
              <span className="gradient-text-blue">funciona</span>
            </h2>
            <p className="text-white/50 mt-4 max-w-xl mx-auto">
              Do zero à entrega do seu projeto em três passos. Sem complicação.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={i} className={`neo-card border ${step.bg} p-8 relative`}>
                <div className="text-6xl font-black text-white/5 absolute top-4 right-6 select-none">
                  {step.n}
                </div>
                <div className={`w-12 h-12 rounded-xl border ${step.bg} flex items-center justify-center mb-5`}>
                  <step.icon className={`w-6 h-6 ${step.color}`} />
                </div>
                <h3 className="font-bold text-xl mb-3">{step.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ÁREAS ───────────────────────────────────────────── */}
      <section id="areas" className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/60 tracking-widest mb-4">
              ESPECIALIDADES
            </div>
            <h2 className="text-4xl md:text-5xl font-black">
              Sua área de{" "}
              <span className="gradient-text-blue">conhecimento</span>
            </h2>
            <p className="text-white/50 mt-4 max-w-lg mx-auto">
              Orientadores especializados em cada grande área do saber acadêmico.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {areas.map((area) => (
              <Link
                key={area.id}
                href="/cadastro"
                className={`neo-card border ${area.border} p-6 group cursor-pointer hover:scale-[1.02] transition-all duration-200`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${area.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <area.icon className={`w-6 h-6 ${area.iconColor}`} />
                </div>
                <h3 className="font-bold text-lg mb-1">{area.label}</h3>
                <p className="text-white/45 text-xs leading-relaxed mb-3">{area.desc}</p>
                <div className={`text-xs font-semibold ${area.iconColor} flex items-center gap-1`}>
                  <Users className="w-3 h-3" />
                  {area.count}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DIFERENCIAIS ─────────────────────────────────────── */}
      <section className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/60 tracking-widest mb-6">
                POR QUE NEO HUB
              </div>
              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
                Orientação contínua,<br />
                não tarefas{" "}
                <span className="gradient-text-blue">pontuais</span>
              </h2>
              <p className="text-white/55 leading-relaxed mb-8">
                Diferente de plataformas que resolvem exercícios avulsos, o NEO HUB conecta você a um orientador dedicado para toda a duração do seu projeto. Um relacionamento de longo prazo, com foco no seu crescimento acadêmico real.
              </p>
              <Link href="/cadastro" className="neo-btn-primary">
                Começar meu projeto <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {diferenciais.map((d, i) => (
                <div key={i} className="neo-card neo-card-blue p-5">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
                    <d.icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <h4 className="font-bold text-sm mb-1">{d.title}</h4>
                  <p className="text-white/45 text-xs leading-relaxed">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── DEPOIMENTOS ─────────────────────────────────────── */}
      <section id="depoimentos" className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/60 tracking-widest mb-4">
              RESULTADOS REAIS
            </div>
            <h2 className="text-4xl md:text-5xl font-black">
              O que os alunos{" "}
              <span className="gradient-text-blue">dizem</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="neo-card p-6 flex flex-col">
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed flex-1 mb-5">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-sm font-bold shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-white/45 text-xs">{t.course}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ───────────────────────────────────────── */}
      <section className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="neo-card neo-card-blue p-12 md:p-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300 tracking-widest mb-6">
              <CheckCircle2 className="w-3.5 h-3.5" />
              GRATUITO PARA COMEÇAR
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-5 leading-tight">
              Pronto para{" "}
              <span className="gradient-text">evoluir</span>?
            </h2>
            <p className="text-white/55 text-lg max-w-md mx-auto mb-10">
              Publique sua primeira missão agora e receba propostas de orientadores especializados em minutos.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/cadastro" className="neo-btn-primary text-base px-8 py-4">
                Criar conta grátis <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/login" className="neo-btn-ghost text-base px-8 py-4">
                Já tenho conta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm font-black">N</div>
                <span className="font-black tracking-wider">NEO <span className="gradient-text-blue italic">HUB</span></span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                O hub definitivo onde a demanda intelectual encontra a maestria acadêmica. Conectamos desafios reais a soluções de alto nível.
              </p>
            </div>

            {/* Links */}
            <div>
              <h5 className="font-semibold text-sm mb-4 text-white/80">Plataforma</h5>
              <ul className="space-y-2.5 text-sm text-white/45">
                <li><Link href="/cadastro" className="hover:text-white transition">Criar conta</Link></li>
                <li><Link href="/login" className="hover:text-white transition">Entrar</Link></li>
                <li><a href="#como-funciona" className="hover:text-white transition">Como funciona</a></li>
                <li><a href="#areas" className="hover:text-white transition">Áreas</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-sm mb-4 text-white/80">Legal</h5>
              <ul className="space-y-2.5 text-sm text-white/45">
                <li><span className="cursor-default">Termos de uso</span></li>
                <li><span className="cursor-default">Privacidade</span></li>
                <li><span className="cursor-default">Código de honra</span></li>
              </ul>
            </div>
          </div>

          <div className="neo-divider mb-6" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-sm">
            <span>© 2026 NEO HUB. Todos os direitos reservados.</span>
            <span>A evolução é orientada.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
