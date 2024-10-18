import Image from "apps/website/components/Image.tsx";

function UserIcon() {
  return (
    <>
      <label class="indicator text-secondary" aria-label="user-login">
        <span class="hidden indicator-item badge badge-primary badge-sm font-thin" />

        <a
          href="/entrar"
          class="btn btn-square btn-sm btn-outline no-animation hover:bg-accent text-secondary border border-secondary hover:border-secondary"
        >
          <Image
            src="https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/12156/324a44b4-d32b-48de-a32c-c6e991271d94"
            alt="icone de usuario"
            width={20}
            height={20}
          />
        </a>
      </label>
    </>
  );
}

export default UserIcon;
