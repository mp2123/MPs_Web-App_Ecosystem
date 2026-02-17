// apps/mixology-app/src/components/ui/header-1.tsx
'use client';
import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import { SearchCommand } from '@/components/ui/search-command';

interface HeaderProps {
  onSignInClick: () => void;
}

export function Header({ onSignInClick }: HeaderProps) {
	const [user, setUser] = React.useState<any>(null);
	const supabase = createClient();

	React.useEffect(() => {
		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
		});
		supabase.auth.getUser().then(({ data: { user }}) => setUser(user));
		return () => subscription.unsubscribe();
	}, []);

	const links = [
		{ label: 'Cocktail Library', href: '#recipes' },
		{ label: 'Video Tutorials', href: '#tutorials' },
		{ label: 'Bar Tools', href: '#tools' },
	];

	return (
		<header className={cn('sticky top-0 z-50 w-full border-b border-transparent bg-background/80 backdrop-blur-sm')}>
			<nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
				<a href="#home" className="hover:bg-accent rounded-md p-2 transition-colors">
					<WordmarkIcon className="h-4" />
				</a>
				<div className="flex-1 flex justify-center md:justify-start md:pl-4">
					<SearchCommand />
				</div>
				<div className="hidden items-center gap-2 md:flex">
					{links.map((link) => (
						<a key={link.label} className={buttonVariants({ variant: 'ghost' })} href={link.href}>
							{link.label}
						</a>
					))}
					<div className="w-px h-6 bg-border mx-2"/>
					{user ? (
						<>
							<span className="text-xs text-muted-foreground font-mono truncate max-w-[150px]">{user.email}</span>
							<Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>Sign Out</Button>
						</>
					) : (
						<>
							<Button variant="outline" onClick={onSignInClick}>Sign In</Button>
							<a href="#recipes"><Button>Get Started</Button></a>
						</>
					)}
				</div>
                {/* Mobile menu can be added back here if needed */}
			</nav>
		</header>
	);
}

export const WordmarkIcon = (props: React.ComponentProps<"svg">) => (
  <svg viewBox="0 0 84 24" fill="currentColor" {...props}><path d="M45.035 23.984c-1.34-.062-2.566-.441-3.777-1.16-1.938-1.152-3.465-3.187-4.02-5.36-.199-.784-.238-1.128-.234-2.058 0-.691.008-.87.062-1.207.23-1.5.852-2.883 1.852-4.144.297-.371 1.023-1.09 1.41-1.387 1.399-1.082 2.84-1.68 4.406-1.816.536-.047 1.528-.02 2.047.054 1.227.184 2.227.543 3.106 1.121 1.277.84 2.5 2.184 3.367 3.7.098.168.172.308.172.312-.004 0-1.047.723-2.32 1.598l-2.711 1.867c-.61.422-2.91 2.008-2.993 2.062l-.074.047-1-1.574c-.55-.867-1.008-1.594-1.012-1.61-.007-.019.922-.648 2.188-1.476 1.215-.793 2.2-1.453 2.191-1.46-.02-.032-.508-.27-.691-.34a5 5 0 0 0-.465-.13c-.371-.09-1.105-.125-1.426-.07-1.285.219-2.336 1.3-2.777 2.852-.215.761-.242 1.636-.074 2.355.129.527.383 1.102.691 1.543.234.332.727.82 1.047 1.031.664.434 1.195.586 1.969.555.613-.023 1.027-.129 1.64-.426 1.184-.574 2.16-1.554 2.828-2.843.122-.235.208-.372.227-.368.082.032 3.77 1.938 3.79 1.961.034.032-.407.93-.696 1.414a12 12 0 0 1-1.051 1.477c-.36.422-1.102 1.14-1.492 1.445a9.9 9.9 0 0 1-3.23 1.684 9.2 9.2 0 0 1-2.95.351M74.441 23.996c-1.488-.043-2.8-.363-4.066-.992-1.687-.848-2.992-2.14-3.793-3.774-.605-1.234-.863-2.402-.863-3.894.004-1.149.176-2.156.527-3.11.14-.378.531-1.171.75-1.515 1.078-1.703 2.758-2.934 4.805-3.524.847-.242 1.465-.332 2.433-.351 1.032-.024 1.743.055 2.48.277l.31.09.007 2.48c.004 1.364 0 2.481-.008 2.481a1 1 0 0 1-.12-.055c-.688-.347-2.09-.488-2.962-.296-.754.167-1.296.453-1.785.945a3.7 3.7 0 0 0-1.043 2.11c-.047.382-.02 1.109.055 1.437a3.4 3.4 0 0 0 .941 1.738c.75.75 1.715 1.102 2.875 1.05.645-.03 1.118-.14 1.563-.366q1.721-.864 2.02-3.145c.035-.293.042-1.266.042-7.957V0H84l-.012 8.434c-.008 7.851-.011 8.457-.054 8.757-.196 1.274-.586 2.25-1.301 3.243-1.293 1.808-3.555 3.07-6.145 3.437-.664.098-1.43.14-2.047.125M9.848 23.574a14 14 0 0 1-1.137-.152c-2.352-.426-4.555-1.781-6.117-3.774-.27-.335-.75-1.05-.95-1.406-1.156-2.047-1.695-4.27-1.64-6.77.047-1.995.43-3.66 1.23-5.316.524-1.086 1.04-1.87 1.793-2.715C4.567 1.72 6.652.535 8.793.171 9.68.02 10.093 0 12.297 0h9.39c2.203 0 2.618.02 3.5.172 2.117.363 4.203 1.55 6.117 3.465.78.78 1.402 1.625 1.945 2.656.86 1.63 1.282 3.39 1.282 5.383-.004 2.375-.52 4.51-1.528 6.32-1.023 1.84-2.586 3.28-4.305 4.09-1.27.59-2.61.94-4.047 1.054-1.14.09-3.086.09-4.226 0-1.137-.086-2.2-.355-3.148-.793m6.14-3.562c1.785-.508 3.23-1.71 4.227-3.488.582-1.03.88-2.1.92-3.32.062-1.93-.4-3.8-1.37-5.51-1.575-2.78-4.38-4.43-7.3-4.29-2.63.124-4.902 1.562-6.445 4.097-1.11 1.825-1.57 3.86-1.398 6.13.125 1.65.64 3.06 1.55 4.226.96 1.23 2.16 2.13 3.53 2.645 1.03.38 2.05.54 3.12.54 1.07 0 2.09-.16 3.12-.54M60.336 18.035l.008 5.461h-2.906l-.008-5.46c-.004-4.39-.027-5.508-.105-5.75-.24-1.02-.92-1.68-1.92-1.88-1.1-.222-2.1.02-2.83,.69-1.03.95-1.4 2.6-1.03 4.6v7.71h-2.91V5.59h2.91v1.65c.6-.94 1.1-1.35 2.2-1.78 1.4-.55 3.03-.43 4.2.31 1.83 1.18 2.5 3.3 2.5 7.7v4.56zM40.238 18.035l.008 5.461h-2.906l-.008-5.46c-.004-4.39-.027-5.508-.105-5.75-.24-1.02-.92-1.68-1.92-1.88-1.1-.222-2.1.02-2.83.69-1.03.95-1.4 2.6-1.03 4.6v7.71h-2.91V5.59h2.91v1.65c.6-.94 1.1-1.35 2.2-1.78 1.4-.55 3.03-.43 4.2.31 1.83 1.18 2.5 3.3 2.5 7.7v4.56z" /></svg>
);
