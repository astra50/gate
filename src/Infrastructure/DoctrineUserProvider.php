<?php

declare(strict_types=1);

namespace App\Infrastructure;

use App\Domain\User\User;
use App\Domain\User\UserNotFound;
use App\Domain\User\UserStorage;
use HWI\Bundle\OAuthBundle\OAuth\Response\UserResponseInterface;
use HWI\Bundle\OAuthBundle\Security\Core\User\OAuthAwareUserProviderInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationServiceException;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;

/**
 * @see \HWI\Bundle\OAuthBundle\Security\Core\User\EntityUserProvider
 */
final class DoctrineUserProvider implements UserProviderInterface, OAuthAwareUserProviderInterface
{
    private UserStorage $storage;

    public function __construct(UserStorage $storage)
    {
        $this->storage = $storage;
    }

    /**
     * {@inheritdoc}
     */
    public function loadUserByOAuthUserResponse(UserResponseInterface $response)
    {
        $email = $response->getEmail();

        if (null === $email) {
            throw new AuthenticationServiceException('OAuth2 server return null username');
        }

        try {
            return $this->storage->getByUsername($email);
        } catch (UserNotFound $e) {
            $user = new User($email, []);

            $this->storage->add($user);

            return $user;
        }
    }

    /**
     * {@inheritdoc}
     */
    public function loadUserByUsername(string $username): User
    {
        try {
            return $this->storage->getByUsername($username);
        } catch (UserNotFound $e) {
            $e = new UsernameNotFoundException();
            $e->setUsername($username);

            throw $e;
        }
    }

    /**
     * {@inheritdoc}
     */
    public function refreshUser(UserInterface $user)
    {
        return $this->storage->getByUsername($user->getUsername());
    }

    /**
     * {@inheritdoc}
     */
    public function supportsClass(string $class): bool
    {
        return User::class === $class;
    }
}
